import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string;
            role?: "LEERLING" | "PERSONEEL" | "ADMIN";
        } & DefaultSession["user"];
    }
}