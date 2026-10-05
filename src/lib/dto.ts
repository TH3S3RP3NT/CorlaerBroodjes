import type { users, products, orders } from "@/db/schema";

// Vertaalt databaserijen naar de JSON-vormen die de iOS-app verwacht.
// Bedragen gaan als gehele centen over de lijn (geen kommagetallen).

export function toCents(value: string | number): number {
    return Math.round(Number(value) * 100);
}

export function userDto(user: typeof users.$inferSelect) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
    };
}

export function productDto(product: typeof products.$inferSelect) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        priceCents: toCents(product.price),
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        inStock: product.isAvailable && product.stockQuantity > 0,
        preparationTimeMinutes: product.preparationTimeMinutes,
    };
}

export type OrderWithRelations = {
    id: number;
    status: (typeof orders.$inferSelect)["status"];
    totalPrice: string;
    pickupTime: Date;
    estimatedWaitTimeMinutes: number;
    createdAt: Date;
    location?: { id: number; name: string } | null;
    orderItems: {
        id: number;
        productId: number;
        quantity: number;
        unitPrice: string;
        product?: { name: string } | null;
    }[];
};

export function orderDto(order: OrderWithRelations) {
    return {
        id: order.id,
        status: order.status,
        totalCents: toCents(order.totalPrice),
        pickupTime: order.pickupTime.toISOString(),
        estimatedWaitTimeMinutes: order.estimatedWaitTimeMinutes,
        createdAt: order.createdAt.toISOString(),
        location: order.location ? { id: order.location.id, name: order.location.name } : null,
        items: order.orderItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.product?.name ?? "Onbekend product",
            quantity: item.quantity,
            unitPriceCents: toCents(item.unitPrice),
        })),
    };
}
