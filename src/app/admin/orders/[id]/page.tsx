import { notFound } from "next/navigation";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { StatusBadge } from "@/app/status-badge";
import { requireAdmin } from "@/lib/auth";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
        notFound();
    }

    await requireAdmin();

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
        <main className="order-detail-page">
    <Link className="order-detail-page__back" href="/admin">
← Terug naar Admin Dashboard
    </Link>

    <h1>Order Details #{order.id}</h1>

    {/* Algemene Status & Klant Info */}
    <section className="order-detail__summary">
    <p><strong>Status:</strong> <StatusBadge status={order.status} /></p>
    <p><strong>Klant:</strong> {order.user.name} ({order.user.email})</p>
    <p><strong>Locatie:</strong> {order.location?.name || "Niet opgegeven"}</p>
    <p><strong>Ophaaltijd:</strong> {order.pickupTime ? new Date(order.pickupTime).toLocaleString("nl-NL") : "Direct"}</p>
    <p><strong>Geschatte wachttijd:</strong> {order.estimatedWaitTimeMinutes} minuten</p>
    <p><strong>Aangemaakt op:</strong> {new Date(order.createdAt).toLocaleString("nl-NL")}</p>
    </section>

    {/* Bestelde Producten */}
    <section>
        <h2>Bestelde Producten</h2>
    <table className="order-detail__items">
    <thead>
        <tr>
    <th>Product</th>
    <th>Aantal</th>
    <th>Stukprijs</th>
    <th>Totaal</th>
    </tr>
    </thead>
    <tbody>
    {order.orderItems.map((item) => (
            <tr key={item.id}>
    <td>{item.product.name}</td>
    <td>{item.quantity}x</td>
    <td>€{Number(item.unitPrice).toFixed(2)}</td>
    <td>
    €{(item.quantity * Number(item.unitPrice)).toFixed(2)}
    </td>
    </tr>
))}
    </tbody>
    </table>

    <div className="order-detail__total">
    <strong>Totaalbedrag: €{Number(order.totalPrice).toFixed(2)}</strong>
    </div>
    </section>
    </main>
);
}