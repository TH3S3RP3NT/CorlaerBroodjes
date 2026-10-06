import { and, eq, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";

export async function cancelStaleOrders() {
    const cutoff = new Date(Date.now() - 10 * 60_000);

    await db.transaction(async (tx) => {
        const stale = await tx
            .update(orders)
            .set({ status: "CANCELLED" })
            .where(and(eq(orders.status, "PENDING_PAYMENT"), lt(orders.createdAt, cutoff)))
            .returning({ id: orders.id });
        if (stale.length === 0) return;

        const lines = await tx
            .select()
            .from(orderItems)
            .where(inArray(orderItems.orderId, stale.map((order) => order.id)));
        const totals = new Map<number, number>();
        for (const line of lines) {
            totals.set(line.productId, (totals.get(line.productId) ?? 0) + line.quantity);
        }

        for (const [productId, quantity] of [...totals].sort((a, b) => a[0] - b[0])) {
            await tx
                .update(products)
                .set({ stockQuantity: sql`${products.stockQuantity} + ${quantity}` })
                .where(eq(products.id, productId));
        }
    });
}
