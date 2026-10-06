import { db } from "@/db";
import Link from "next/link";
import { StatusBadge } from "@/app/status-badge";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
    const session = await requireAdmin();
    const allOrders = await db.query.orders.findMany({
        with: {
            user: true,
            orderItems: {
                with: {
                    product: true,
                },
            },
        },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        limit: 50,
    });

    return (
        <main className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Welkom, {session.user.name}. Je bent ingelogd als <strong>ADMIN</strong>.</p>

            <section className="admin-page__section">
                <h2>Alle Bestellingen ({allOrders.length})</h2>
                {allOrders.length === 0 ? (
                    <p>Er zijn nog geen bestellingen geplaatst.</p>
                ) : (
                    <ul className="admin-page__orders">
                        {allOrders.map((order) => (
                            <li className="admin-order" key={order.id}>
                                <p className="admin-order__heading">
                                    <strong>Order #{order.id}</strong>
                                    <StatusBadge status={order.status} />
                                </p>
                                <p>Klant: {order.user.name}</p>
                                <p>Totaal: €{Number(order.totalPrice).toFixed(2)}</p>

                                <Link className="admin-order__link" href={`/admin/orders/${order.id}`}>
                                    Bekijk Details →
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}