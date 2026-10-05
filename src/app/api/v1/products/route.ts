import { asc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { authenticate, jsonError } from "@/lib/api";
import { productDto } from "@/lib/dto";

// Alle producten met live voorraad. "inStock" is false bij uitverkocht (FE5/FE18).
export async function GET(request: Request) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    try {
        const rows = await db.select().from(products).orderBy(asc(products.name));
        return Response.json({ products: rows.map(productDto) });
    } catch (error) {
        console.error("[api/v1/products]", error);
        return jsonError(500, "serverfout", "Het menu kon niet worden geladen.");
    }
}
