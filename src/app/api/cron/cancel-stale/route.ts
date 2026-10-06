import { cancelStaleOrders } from "@/lib/stale-orders";

export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
        return new Response("Unauthorized", { status: 401 });
    }
    await cancelStaleOrders();
    return Response.json({ ok: true });
}