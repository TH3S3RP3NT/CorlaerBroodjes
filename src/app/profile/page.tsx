import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const userOrders = await db.query.orders.findMany({
        where: eq(orders.userId, session.user.id),
        orderBy: [desc(orders.createdAt)],
        with: {
            orderItems: {
                with: {
                    product: true,
                },
            },
        },
    });

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#0070f3", fontSize: "0.9rem" }}>
                ← Terug naar Home
            </Link>

            <h1 style={{ marginTop: "1rem" }}>Mijn Profiel</h1>

            {/* Gebruikersinformatie Card */}
            <section
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    background: "#f9f9f9",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid #e0e0e0",
                    marginBottom: "2rem",
                }}
            >
                {session.user.image && (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "Profielfoto"}
                        width={80}
                        height={80}
                        style={{ borderRadius: "50%" }}
                    />
                )}
                <div>
                    <h2 style={{ margin: "0 0 0.5rem 0" }}>{session.user.name}</h2>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#555" }}>
                        <strong>E-mail:</strong> {session.user.email}
                    </p>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#555" }}>
                        <strong>Account ID:</strong> <code>{session.user.id}</code>
                    </p>
                    <p style={{ margin: "0", color: "#555" }}>
                        <strong>Rol:</strong>{" "}
                        <span
                            style={{
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: session.user.role === "ADMIN" ? "#ffebee" : "#e3f2fd",
                                color: session.user.role === "ADMIN" ? "#c62828" : "#1565c0",
                                fontWeight: "bold",
                                fontSize: "0.85rem",
                            }}
                        >
              {session.user.role}
            </span>
                    </p>
                </div>
            </section>

            {/* Mijn Bestellingen */}
            <section>
                <h2>Mijn Bestellingen ({userOrders.length})</h2>

                {userOrders.length === 0 ? (
                    <p style={{ color: "#666" }}>Je hebt nog geen bestellingen geplaatst.</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                        {userOrders.map((order) => (
                            <div
                                key={order.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    background: "#fff",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <strong>Order #{order.id}</strong>
                                    <span
                                        style={{
                                            padding: "2px 8px",
                                            borderRadius: "4px",
                                            fontSize: "0.85rem",
                                            background: "#eee",
                                        }}
                                    >
                    {order.status}
                  </span>
                                </div>

                                <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", color: "#666" }}>
                                    Datum: {new Date(order.createdAt).toLocaleString("nl-NL")}
                                </p>

                                <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0" }}>
                                    {order.orderItems.map((item) => (
                                        <li key={item.id} style={{ fontSize: "0.95rem" }}>
                                            {item.quantity}x {item.product.name} — €{Number(item.unitPrice).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ textAlign: "right", fontWeight: "bold", marginTop: "0.5rem" }}>
                                    Totaal: €{Number(order.totalPrice).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}