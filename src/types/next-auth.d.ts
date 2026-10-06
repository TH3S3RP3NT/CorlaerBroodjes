import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string;
            role?: "LEERLING" | "PERSONEEL" | "ADMIN";
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        uid?: string;
        role?: "LEERLING" | "PERSONEEL" | "ADMIN";
    }
}