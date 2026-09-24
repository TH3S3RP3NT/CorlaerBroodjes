import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: number;
            role?: "LEERLING" | "PERSONEEL" | "ADMIN";
        } & DefaultSession["user"];
    }
}