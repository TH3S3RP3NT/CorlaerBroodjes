import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is niet ingesteld in .env.local");
}

// Supabase vereist 'prepare: false' voor poort 6543 (transaction pooler)
const globalForPostgres = globalThis as unknown as {
    pg?: ReturnType<typeof postgres>;
};
const client = globalForPostgres.pg ?? postgres(connectionString, { prepare: false, max: 1 });

if (process.env.NODE_ENV !== "production") {
    globalForPostgres.pg = client;
}

export const db = drizzle(client, { schema });