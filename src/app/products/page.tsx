import { asc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import Link from "next/link";

export default async function ProductsPage() {
    const productRows = await db.query.products.findMany({
        orderBy: [asc(products.name)],
    });

    return (
        <main className="products-page">
            <section className="products-page__intro">
                <p className="eyebrow">Ons menu</p>
                <h1>Broodjes voor elke pauze</h1>
                <p>
                    Bekijk ons actuele aanbod. Producten die uitverkocht zijn, herken je
                    aan het label bij het product.
                </p>
            </section>

            {productRows.length === 0 ? (
                <p className="products-empty">Er zijn momenteel geen producten beschikbaar.</p>
            ) : (
                <section className="products-grid" aria-label="Productaanbod">
                    {productRows.map((product) => {
                        const available = product.isAvailable && product.stockQuantity > 0;

                        return (
                            <Link className="product-card" href={`/products/${product.id}`} key={product.id}>
                                {product.imageUrl && (
                                    <div
                                        className="product-card__image"
                                        style={{ backgroundImage: `url("${product.imageUrl}")` }}
                                        role="img"
                                        aria-label={product.name}
                                    />
                                )}
                                <div className="product-card__topline">
                                    <span className={`product-status${available ? "" : " product-status--unavailable"}`}>
                                        {available ? "Beschikbaar" : "Uitverkocht"}
                                    </span>
                                    <strong className="product-card__price">
                                        €{Number(product.price).toFixed(2)}
                                    </strong>
                                </div>
                                <h2>{product.name}</h2>
                                <p>{product.description || "Een vers bereid broodje uit onze kantine."}</p>
                                <span className="product-card__time">
                                    Klaar in ongeveer {product.preparationTimeMinutes} minuten
                                </span>
                            </Link>
                        );
                    })}
                </section>
            )}
        </main>
    );
}
