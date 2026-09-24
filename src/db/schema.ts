import {
    mysqlTable,
    serial,
    varchar,
    text,
    decimal,
    int,
    boolean,
    mysqlEnum,
    timestamp,
    date,
    uniqueIndex,
    index
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// 1. Users
export const users = mysqlTable('users', {
    id: serial('id').primaryKey(),
    googleId: varchar('google_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    role: mysqlEnum('role', ['LEERLING', 'PERSONEEL', 'ADMIN']).default('LEERLING').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// 2. Locations
export const locations = mysqlTable('locations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// 3. Products
export const products = mysqlTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    price: decimal('price', { precision: 6, scale: 2 }).notNull(),
    imageUrl: text('image_url'),
    stockQuantity: int('stock_quantity').default(0).notNull(),
    isAvailable: boolean('is_available').default(true).notNull(),
    preparationTimeMinutes: int('preparation_time_minutes').default(2).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// 4. Orders
export const orders = mysqlTable('orders', {
    id: serial('id').primaryKey(),
    userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    locationId: int('location_id').notNull().references(() => locations.id, { onDelete: 'restrict' }),
    totalPrice: decimal('total_price', { precision: 6, scale: 2 }).notNull(),
    status: mysqlEnum('status', ['PENDING_PAYMENT', 'PAID', 'IN_PREPARATION', 'READY', 'COMPLETED', 'CANCELLED'])
        .default('PENDING_PAYMENT')
        .notNull(),
    pickupTime: timestamp('pickup_time').notNull(),
    estimatedWaitTimeMinutes: int('estimated_wait_time_minutes').default(0).notNull(),
    sumupTransactionId: varchar('sumup_transaction_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    userIdIdx: index('idx_orders_user').on(table.userId),
    statusIdx: index('idx_orders_status').on(table.status),
    pickupTimeIdx: index('idx_orders_pickup_time').on(table.pickupTime),
}));

// 5. Order Items
export const orderItems = mysqlTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: int('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: int('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
    quantity: int('quantity').default(1).notNull(),
    unitPrice: decimal('unit_price', { precision: 6, scale: 2 }).notNull(),
});

// 6. Daily Forecasts
export const dailyForecasts = mysqlTable('daily_forecasts', {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    productId: int('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    predictedSales: int('predicted_sales').default(0).notNull(),
    actualSales: int('actual_sales'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    dateProductUq: uniqueIndex('uq_date_product').on(table.date, table.productId),
    dateIdx: index('idx_daily_forecasts_date').on(table.date),
}));