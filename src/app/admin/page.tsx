import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import Link from "next/link";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }
    if (session.user.role !== "ADMIN") {
        redirect("/");
    }
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
    });

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Admin Dashboard</h1>
            <p>Welkom, {session.user.name}. Je bent ingelogd als <strong>ADMIN</strong>.</p>

            <section style={{ marginTop: "2rem" }}>
                <h2>Alle Bestellingen ({allOrders.length})</h2>
                {allOrders.length === 0 ? (
                    <p>Er zijn nog geen bestellingen geplaatst.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {allOrders.map((order) => (
                            <li key={order.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "8px" }}>
                                <p><strong>Order #{order.id}</strong> — Status: {order.status}</p>
                                <p>Klant: {order.user.name}</p>
                                <p>Totaal: €{Number(order.totalPrice).toFixed(2)}</p>

                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    style={{
                                        display: "inline-block",
                                        marginTop: "0.5rem",
                                        padding: "6px 12px",
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        borderRadius: "4px",
                                        textDecoration: "none"
                                    }}
                                >
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