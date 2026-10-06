import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const productId = Number.parseInt(id, 10);

    if (Number.isNaN(productId)) {
        notFound();
    }

    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
    });

    if (!product) {
        notFound();
    }

    const available = product.isAvailable && product.stockQuantity > 0;

    return (
        <main className="product-detail-page">
            <Link className="product-detail__back" href="/products">
                ← Terug naar producten
            </Link>
            <article className="product-detail">
                <div className="product-detail__visual">
                    {product.imageUrl ? (
                        <div
                            className="product-detail__image"
                            style={{ backgroundImage: `url("${product.imageUrl}")` }}
                            role="img"
                            aria-label={product.name}
                        />
                    ) : (
                        <span className="product-detail__placeholder">Vers bereid</span>
                    )}
                </div>
                <div className="product-detail__content">
                    <span className={`product-status${available ? "" : " product-status--unavailable"}`}>
                        {available ? "Beschikbaar" : "Uitverkocht"}
                    </span>
                    <h1>{product.name}</h1>
                    <strong className="product-detail__price">€{Number(product.price).toFixed(2)}</strong>
                    <p className="product-detail__description">
                        {product.description || "Een vers bereid broodje uit onze kantine."}
                    </p>
                    <div className="product-detail__meta">
                        <span>Bereidingstijd</span>
                        <strong>Ongeveer {product.preparationTimeMinutes} minuten</strong>
                    </div>
                    <p className="product-detail__availability">
                        {available
                            ? `${product.stockQuantity} op voorraad`
                            : "Dit product is momenteel niet beschikbaar."}
                    </p>
                </div>
            </article>
        </main>
    );
}
