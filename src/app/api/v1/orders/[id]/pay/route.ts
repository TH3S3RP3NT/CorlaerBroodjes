import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { authenticate, jsonError } from "@/lib/api";
import { orderDto } from "@/lib/dto";

type RouteContext = { params: Promise<{ id: string }> };

// PLAATSHOUDER voor de SumUp-betaling (FE11-FE14).
// Zolang SumUp niet is gekoppeld doet deze route niets, tenzij ALLOW_FAKE_PAYMENT=true staat
// (alleen voor test/demo!). Dan wordt de bestelling zonder echte betaling op PAID gezet.
// Vervang dit door een SumUp-checkout plus een webhook die de status bijwerkt.
export async function POST(request: Request, { params }: RouteContext) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    if (process.env.ALLOW_FAKE_PAYMENT !== "true") {
        return jsonError(501, "betaling_niet_beschikbaar", "Online betalen is nog niet beschikbaar.");
    }

    const orderId = Number((await params).id);
    if (!Number.isInteger(orderId) || orderId <= 0) {
        return jsonError(404, "niet_gevonden", "Deze bestelling bestaat niet.");
    }

    const [paid] = await db
        .update(orders)
        .set({ status: "PAID", sumupTransactionId: `FAKE-${orderId}-${Date.now()}` })
        .where(
            and(
                eq(orders.id, orderId),
                eq(orders.userId, auth.user.id),
                eq(orders.status, "PENDING_PAYMENT")
            )
        )
        .returning({ id: orders.id });

    if (!paid) {
        return jsonError(409, "niet_betaalbaar", "Deze bestelling kan niet worden betaald.");
    }

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: { location: true, orderItems: { with: { product: true } } },
    });
    if (!order) {
        return jsonError(404, "niet_gevonden", "Deze bestelling bestaat niet.");
    }
    return Response.json({ order: orderDto(order) });
}
