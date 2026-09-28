import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
        notFound();
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/");
    }

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
            user: true,
            location: true,
            orderItems: {
                with: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
    <Link href="/admin" style={{ textDecoration: "none", color: "#0070f3", fontSize: "0.9rem" }}>
← Terug naar Admin Dashboard
    </Link>

    <h1 style={{ marginTop: "1rem" }}>Order Details #{order.id}</h1>

    {/* Algemene Status & Klant Info */}
    <section style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem" }}>
    <p><strong>Status:</strong> <span style={{ padding: "4px 8px", background: "#eee", borderRadius: "4px" }}>{order.status}</span></p>
    <p><strong>Klant:</strong> {order.user.name} ({order.user.email})</p>
    <p><strong>Locatie:</strong> {order.location?.name || "Niet opgegeven"}</p>
    <p><strong>Ophaaltijd:</strong> {order.pickupTime ? new Date(order.pickupTime).toLocaleString("nl-NL") : "Direct"}</p>
    <p><strong>Geschatte wachttijd:</strong> {order.estimatedWaitTimeMinutes} minuten</p>
    <p><strong>Aangemaakt op:</strong> {new Date(order.createdAt).toLocaleString("nl-NL")}</p>
    </section>

    {/* Bestelde Producten */}
    <section>
        <h2>Bestelde Producten</h2>
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
    <thead>
        <tr style={{ borderBottom: "2px solid #ddd", textAlign: "left" }}>
    <th style={{ padding: "8px" }}>Product</th>
    <th style={{ padding: "8px" }}>Aantal</th>
    <th style={{ padding: "8px" }}>Stukprijs</th>
    <th style={{ padding: "8px", textAlign: "right" }}>Totaal</th>
    </tr>
    </thead>
    <tbody>
    {order.orderItems.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
    <td style={{ padding: "8px" }}>{item.product.name}</td>
    <td style={{ padding: "8px" }}>{item.quantity}x</td>
    <td style={{ padding: "8px" }}>€{Number(item.unitPrice).toFixed(2)}</td>
    <td style={{ padding: "8px", textAlign: "right" }}>
    €{(item.quantity * Number(item.unitPrice)).toFixed(2)}
    </td>
    </tr>
))}
    </tbody>
    </table>

    <div style={{ textAlign: "right", marginTop: "1.5rem", fontSize: "1.2rem" }}>
    <strong>Totaalbedrag: €{Number(order.totalPrice).toFixed(2)}</strong>
    </div>
    </section>
    </main>
);
}