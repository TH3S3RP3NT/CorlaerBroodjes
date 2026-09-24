import {
    pgTable,
    serial,
    varchar,
    text,
    numeric,
    integer,
    boolean,
    pgEnum,
    timestamp,
    date,
    uniqueIndex,
    index
} from 'drizzle-orm/pg-core';

// PostgreSQL Enums definiëren
export const roleEnum = pgEnum('role', ['LEERLING', 'PERSONEEL', 'ADMIN']);
export const orderStatusEnum = pgEnum('order_status', [
    'PENDING_PAYMENT',
    'PAID',
    'IN_PREPARATION',
    'READY',
    'COMPLETED',
    'CANCELLED'
]);

// 1. Users
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    googleId: varchar('google_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url'),
    role: roleEnum('role').default('LEERLING').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Locations
export const locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Products
export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    price: numeric('price', { precision: 6, scale: 2 }).notNull(),
    imageUrl: text('image_url'),
    stockQuantity: integer('stock_quantity').default(0).notNull(),
    isAvailable: boolean('is_available').default(true).notNull(),
    preparationTimeMinutes: integer('preparation_time_minutes').default(2).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Orders
export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    locationId: integer('location_id').notNull().references(() => locations.id, { onDelete: 'restrict' }),
    totalPrice: numeric('total_price', { precision: 6, scale: 2 }).notNull(),
    status: orderStatusEnum('status').default('PENDING_PAYMENT').notNull(),
    pickupTime: timestamp('pickup_time').notNull(),
    estimatedWaitTimeMinutes: integer('estimated_wait_time_minutes').default(0).notNull(),
    sumupTransactionId: varchar('sumup_transaction_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
    index('idx_orders_user').on(table.userId),
    index('idx_orders_status').on(table.status),
    index('idx_orders_pickup_time').on(table.pickupTime),
]);

// 5. Order Items
export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').default(1).notNull(),
    unitPrice: numeric('unit_price', { precision: 6, scale: 2 }).notNull(),
});

// 6. Daily Forecasts
export const dailyForecasts = pgTable('daily_forecasts', {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    predictedSales: integer('predicted_sales').default(0).notNull(),
    actualSales: integer('actual_sales'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
    uniqueIndex('uq_date_product').on(table.date, table.productId),
    index('idx_daily_forecasts_date').on(table.date),
]);