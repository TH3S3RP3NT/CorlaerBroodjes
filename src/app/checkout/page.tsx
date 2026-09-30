import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

interface PageProps {
    searchParams: Promise<{ productId?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const { productId } = await searchParams;
    if (!productId) {
        redirect("/products");
    }

    const id = parseInt(productId, 10);
    if (isNaN(id)) {
        notFound();
    }

    // Haal de productgegevens op
    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
    });

    if (!product) {
        notFound();
    }

    return (
        <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <Link href="/products" style={{ textDecoration: "none", color: "#2563eb", fontSize: "0.9rem" }}>
                ← Terug naar aanbod
            </Link>

            <h1 style={{ marginTop: "1rem" }}>Bestelling Plaatsen</h1>

            <div
                style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <h2>Overzicht</h2>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
                    <span><strong>Product:</strong> {product.name}</span>
                    <strong>€{Number(product.price).toFixed(2)}</strong>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "1.5rem 0" }} />

                <h3>Klantgegevens</h3>
                <p style={{ margin: "0.25rem 0" }}><strong>Naam:</strong> {session.user.name}</p>
                <p style={{ margin: "0.25rem 0" }}><strong>E-mail:</strong> {session.user.email}</p>

                <form
                    action="/api/orders/create"
                    method="POST"
                    style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    <input type="hidden" name="productId" value={product.id} />

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                            Aantal:
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            defaultValue={1}
                            min={1}
                            max={product.stockQuantity}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#2563eb",
                            color: "white",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "none",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            cursor: "pointer",
                            marginTop: "1rem",
                        }}
                    >
                        Bestelling Bevestigen & Betalen
                    </button>
                </form>
            </div>
        </main>
    );
}