import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { locations, orderItems, orders, products } from "@/db/schema";
import { ApiError, authenticate, jsonError } from "@/lib/api";
import { orderDto } from "@/lib/dto";
import { getBreaks, orderLeadMinutes, pickupInstant } from "@/lib/schedule";

const MAX_QUANTITY_PER_ITEM = 10;
const MAX_DISTINCT_ITEMS = 20;

type OrderInput = {
    locationId: number;
    pickupBreak: number;
    items: { productId: number; quantity: number }[];
};

function parseOrderInput(body: unknown): OrderInput | null {
    if (typeof body !== "object" || body === null) return null;
    const { locationId, pickupBreak, items } = body as Record<string, unknown>;

    if (!Number.isInteger(locationId) || !Number.isInteger(pickupBreak) || !Array.isArray(items)) {
        return null;
    }
    if (items.length === 0 || items.length > MAX_DISTINCT_ITEMS) return null;

    // Dubbele productregels samenvoegen.
    const merged = new Map<number, number>();
    for (const raw of items) {
        if (typeof raw !== "object" || raw === null) return null;
        const { productId, quantity } = raw as Record<string, unknown>;
        if (!Number.isInteger(productId) || !Number.isInteger(quantity)) return null;
        const q = quantity as number;
        if (q < 1 || q > MAX_QUANTITY_PER_ITEM) return null;
        const id = productId as number;
        merged.set(id, (merged.get(id) ?? 0) + q);
    }
    for (const q of merged.values()) {
        if (q > MAX_QUANTITY_PER_ITEM) return null;
    }

    return {
        locationId: locationId as number,
        pickupBreak: pickupBreak as number,
        items: [...merged.entries()].map(([productId, quantity]) => ({ productId, quantity })),
    };
}

// GET /api/v1/orders: eigen bestelgeschiedenis (nieuwste eerst).
export async function GET(request: Request) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    try {
        const rows = await db.query.orders.findMany({
            where: eq(orders.userId, auth.user.id),
            orderBy: [desc(orders.createdAt)],
            with: { location: true, orderItems: { with: { product: true } } },
        });
        return Response.json({ orders: rows.map(orderDto) });
    } catch (error) {
        console.error("[api/v1/orders GET]", error);
        return jsonError(500, "serverfout", "Je bestellingen konden niet worden geladen.");
    }
}

// POST /api/v1/orders
// body: { locationId, pickupBreak (index uit /config), items: [{ productId, quantity }] }
// Prijzen komen altijd uit de database. De voorraad wordt direct gereserveerd; de bestelling
// start als PENDING_PAYMENT en kan via DELETE /orders/{id} worden geannuleerd.
export async function POST(request: Request) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        body = null;
    }
    const input = parseOrderInput(body);
    if (!input) {
        return jsonError(400, "ongeldige_invoer", "De bestelling is niet geldig.");
    }

    const slot = getBreaks()[input.pickupBreak];
    if (!slot) {
        return jsonError(400, "ongeldige_pauze", "Kies een geldige pauze.");
    }

    const now = new Date();
    const pickup = pickupInstant(slot, now);
    if (pickup.getTime() - now.getTime() < orderLeadMinutes() * 60_000) {
        return jsonError(409, "pauze_gesloten", `Bestellen voor de ${slot.name} is niet meer mogelijk.`);
    }

    try {
        const orderId = await db.transaction(async (tx) => {
            const [location] = await tx
                .select()
                .from(locations)
                .where(and(eq(locations.id, input.locationId), eq(locations.isActive, true)))
                .limit(1);
            if (!location) {
                throw new ApiError(400, "ongeldige_locatie", "Deze ophaallocatie is niet beschikbaar.");
            }

            const found = await tx
                .select()
                .from(products)
                .where(inArray(products.id, input.items.map((i) => i.productId)));
            const byId = new Map(found.map((p) => [p.id, p]));

            let totalCents = 0;
            let waitMinutes = 0;
            const lines: { productId: number; quantity: number; unitPrice: string }[] = [];

            for (const item of input.items) {
                const product = byId.get(item.productId);
                if (!product) {
                    throw new ApiError(400, "onbekend_product", "Een product in je bestelling bestaat niet meer.");
                }

                // Atomair controleren en reserveren, zodat de voorraad nooit negatief wordt.
                const reserved = await tx
                    .update(products)
                    .set({ stockQuantity: sql`${products.stockQuantity} - ${item.quantity}` })
                    .where(
                        and(
                            eq(products.id, item.productId),
                            eq(products.isAvailable, true),
                            gte(products.stockQuantity, item.quantity)
                        )
                    )
                    .returning({ id: products.id });
                if (reserved.length === 0) {
                    throw new ApiError(409, "niet_op_voorraad", `${product.name} is niet meer op voorraad.`);
                }

                const unitCents = Math.round(Number(product.price) * 100);
                totalCents += unitCents * item.quantity;
                waitMinutes += product.preparationTimeMinutes * item.quantity;
                lines.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: (unitCents / 100).toFixed(2),
                });
            }

            if (totalCents <= 0) {
                throw new ApiError(400, "ongeldig_bedrag", "Het totaalbedrag moet hoger zijn dan €0,00.");
            }

            const [order] = await tx
                .insert(orders)
                .values({
                    userId: auth.user.id,
                    locationId: location.id,
                    totalPrice: (totalCents / 100).toFixed(2),
                    pickupTime: pickup,
                    // Eenvoudige schatting (som van bereidingstijden); FE9 vraagt later om een wachtrijmodel.
                    estimatedWaitTimeMinutes: waitMinutes,
                })
                .returning({ id: orders.id });

            await tx.insert(orderItems).values(lines.map((line) => ({ orderId: order.id, ...line })));
            return order.id;
        });

        const created = await db.query.orders.findFirst({
            where: eq(orders.id, orderId),
            with: { location: true, orderItems: { with: { product: true } } },
        });
        if (!created) {
            return jsonError(500, "serverfout", "De bestelling is geplaatst maar kon niet worden geladen.");
        }
        return Response.json({ order: orderDto(created) }, { status: 201 });
    } catch (error) {
        if (error instanceof ApiError) {
            return jsonError(error.status, error.code, error.message);
        }
        console.error("[api/v1/orders POST]", error);
        return jsonError(500, "serverfout", "Je bestelling kon niet worden geplaatst. Probeer het opnieuw.");
    }
}
