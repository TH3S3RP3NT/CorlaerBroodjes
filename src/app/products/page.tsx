import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage() {
    // Haal alleen de beschikbare producten op
    const availableProducts = await db.query.products.findMany({
        where: eq(products.isAvailable, true),
    });

    return (
        <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h1>Aanbod Schoolkantine</h1>
            <p style={{ color: "#64748b" }}>Kies wat je wilt eten/drinken en bestel direct online.</p>

            {availableProducts.length === 0 ? (
                <p>Er zijn op dit moment geen producten beschikbaar.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1.5rem",
                        marginTop: "2rem",
                    }}
                >
                    {availableProducts.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                overflow: "hidden",
                                background: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div style={{ padding: "1.25rem" }}>
                                {product.imageUrl && (
                                    <div style={{ position: "relative", width: "100%", height: "160px", marginBottom: "1rem" }}>
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    </div>
                                )}
                                <h3 style={{ margin: "0 0 0.5rem 0" }}>{product.name}</h3>
                                <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1rem 0" }}>
                                    {product.description || "Geen beschrijving beschikbaar"}
                                </p>
                                <div style={{ fontSize: "0.85rem", color: "#475569" }}>
                                    ⏱ Bereidingstijd: {product.preparationTimeMinutes} min<br />
                                    📦 Voorraad: {product.stockQuantity} stuks
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "1rem 1.25rem",
                                    borderTop: "1px solid #f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background: "#fafafa",
                                }}
                            >
                <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f172a" }}>
                  €{Number(product.price).toFixed(2)}
                </span>
                                <Link
                                    href={`/checkout?productId=${product.id}`}
                                    style={{
                                        backgroundColor: "#16a34a",
                                        color: "white",
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        textDecoration: "none",
                                        fontWeight: "bold",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    Bestellen →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}