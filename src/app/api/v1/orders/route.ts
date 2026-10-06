import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { locations, orderItems, orders, products } from "@/db/schema";
import { ApiError, authenticate, jsonError } from "@/lib/api";
import { orderDto } from "@/lib/dto";
import { getBreaks, isSchoolDay, orderLeadMinutes, pickupInstant } from "@/lib/schedule";
import { cancelStaleOrders } from "@/lib/stale-orders";
import { sendOrderConfirmationEmail } from "@/lib/email";

const MAX_QUANTITY_PER_ITEM = 10;
const MAX_DISTINCT_ITEMS = 20;

type OrderInput = {
    locationId: number;
    pickupBreak: number;
    items: { productId: number; quantity: number }[];
};

const orderSchema = z.object({
    locationId: z.number().int(),
    pickupBreak: z.number().int().min(0),
    items: z.array(z.object({
        productId: z.number().int(),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
    })).min(1).max(MAX_DISTINCT_ITEMS),
});

function parseOrderInput(body: unknown): OrderInput | null {
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return null;

    // Dubbele productregels samenvoegen.
    const merged = new Map<number, number>();
    for (const item of parsed.data.items) {
        merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
    }
    for (const q of merged.values()) {
        if (q > MAX_QUANTITY_PER_ITEM) return null;
    }

    return {
        locationId: parsed.data.locationId,
        pickupBreak: parsed.data.pickupBreak,
        items: [...merged.entries()].map(([productId, quantity]) => ({ productId, quantity })),
    };
}

// GET /api/v1/orders: eigen bestelgeschiedenis (nieuwste eerst).
export async function GET(request: Request) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    try {
        const url = new URL(request.url);
        const parsedLimit = Number(url.searchParams.get("limit"));
        const limit = Math.min(Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 20, 50);
        const parsedBefore = Number(url.searchParams.get("before"));
        const before = Number.isInteger(parsedBefore) && parsedBefore > 0 ? parsedBefore : null;
        const rows = await db.query.orders.findMany({
            where: and(
                eq(orders.userId, auth.user.id),
                before ? lt(orders.id, before) : undefined,
            ),
            orderBy: [desc(orders.id)],
            limit,
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
    if (!isSchoolDay()) {
        return jsonError(409, "school_gesloten", "Bestellen is vandaag gesloten.");
    }

    try {
        await cancelStaleOrders();
    } catch (error) {
        console.error("[api/v1/orders POST] stale-order cleanup", error);
        return jsonError(500, "serverfout", "Je bestelling kon niet worden geplaatst. Probeer het opnieuw.");
    }

    const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(and(eq(orders.userId, auth.user.id), eq(orders.status, "PENDING_PAYMENT")));
    if (count >= 2) {
        return jsonError(409, "te_veel_open", "Rond eerst je openstaande bestelling af.");
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

            const items = [...input.items].sort((a, b) => a.productId - b.productId);
            for (const item of items) {
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
                    .returning({
                        id: products.id,
                        name: products.name,
                        price: products.price,
                        prep: products.preparationTimeMinutes,
                    });
                if (reserved.length === 0) {
                    throw new ApiError(409, "niet_op_voorraad", `${product.name} is niet meer op voorraad.`);
                }

                const unitCents = Math.round(Number(reserved[0].price) * 100);
                totalCents += unitCents * item.quantity;
                waitMinutes += reserved[0].prep * item.quantity;
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
        try {
            await sendOrderConfirmationEmail(auth.user.email, created);
        } catch (error) {
            console.error("[api/v1/orders POST] confirmation email", error);
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
