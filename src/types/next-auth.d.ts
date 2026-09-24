import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            role?: "LEERLING" | "PERSONEEL" | "ADMIN";
        } & DefaultSession["user"];
    }
}