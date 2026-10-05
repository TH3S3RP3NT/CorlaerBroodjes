import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ApiError, authenticate, jsonError } from "@/lib/api";
import { orderDto } from "@/lib/dto";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/v1/orders/{id}: alleen je eigen bestellingen.
export async function GET(request: Request, { params }: RouteContext) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    const orderId = parseId((await params).id);
    if (orderId === null) {
        return jsonError(404, "niet_gevonden", "Deze bestelling bestaat niet.");
    }

    const order = await db.query.orders.findFirst({
        where: and(eq(orders.id, orderId), eq(orders.userId, auth.user.id)),
        with: { location: true, orderItems: { with: { product: true } } },
    });
    if (!order) {
        return jsonError(404, "niet_gevonden", "Deze bestelling bestaat niet.");
    }
    return Response.json({ order: orderDto(order) });
}

// DELETE /api/v1/orders/{id}: annuleren zolang er nog niet is betaald; de voorraad komt terug.
export async function DELETE(request: Request, { params }: RouteContext) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    const orderId = parseId((await params).id);
    if (orderId === null) {
        return jsonError(404, "niet_gevonden", "Deze bestelling bestaat niet.");
    }

    try {
        await db.transaction(async (tx) => {
            const [order] = await tx
                .select({ id: orders.id, status: orders.status })
                .from(orders)
                .where(and(eq(orders.id, orderId), eq(orders.userId, auth.user.id)))
                .limit(1);
            if (!order) {
                throw new ApiError(404, "niet_gevonden", "Deze bestelling bestaat niet.");
            }

            // De statuscontrole zit in de UPDATE zelf, zodat dubbel annuleren de voorraad niet twee keer terugzet.
            const cancelled = await tx
                .update(orders)
                .set({ status: "CANCELLED" })
                .where(and(eq(orders.id, orderId), eq(orders.status, "PENDING_PAYMENT")))
                .returning({ id: orders.id });
            if (cancelled.length === 0) {
                throw new ApiError(409, "niet_annuleerbaar", "Deze bestelling kan niet meer worden geannuleerd.");
            }

            const lines = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
            for (const line of lines) {
                await tx
                    .update(products)
                    .set({ stockQuantity: sql`${products.stockQuantity} + ${line.quantity}` })
                    .where(eq(products.id, line.productId));
            }
        });
        return Response.json({ ok: true });
    } catch (error) {
        if (error instanceof ApiError) {
            return jsonError(error.status, error.code, error.message);
        }
        console.error("[api/v1/orders DELETE]", error);
        return jsonError(500, "serverfout", "Annuleren is niet gelukt. Probeer het opnieuw.");
    }
}
