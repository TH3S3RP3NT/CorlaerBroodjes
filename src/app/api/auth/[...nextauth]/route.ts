// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatName, extractUserIdFromEmail } from "@/lib/utils";


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google" && profile && profile.sub && user.email) {
                try {
                    const email = user.email.toLowerCase();
                    const userId = extractUserIdFromEmail(email);
                    const rawName = user.name || "Onbekende gebruiker";
                    const formattedName = formatName(rawName);
                    const avatarUrl = user.image || null;

                    let role: "LEERLING" | "PERSONEEL" = "LEERLING";

                    if (email.endsWith("@corlaercollege.nl")) {
                        role = "PERSONEEL";
                    } else if (email.endsWith("@lln.corlaercollege.nl")) {
                        role = "LEERLING";
                    } else {
                        console.warn(`[NextAuth] Geweigerd domein: ${email}`);
                        return false;
                    }

                    await db
                        .insert(users)
                        .values({
                            id: userId,
                            googleId: profile.sub,
                            email,
                            name: formattedName,
                            avatarUrl,
                            role,
                        })
                        .onConflictDoUpdate({
                            target: users.googleId,
                            set: {
                                name: formattedName,
                                avatarUrl,
                            },
                        });

                    return true;
                } catch (error) {
                    console.error("[NextAuth] Fout tijdens opslaan:", error);
                    return false;
                }
            }


            return false;
        },

        async jwt({ token, user }) {
            if (user?.email) {
                const [dbUser] = await db
                    .select({ id: users.id, role: users.role, name: users.name })
                    .from(users)
                    .where(eq(users.email, user.email.toLowerCase()))
                    .limit(1);
                if (dbUser) {
                    token.uid = dbUser.id;
                    token.role = dbUser.role;
                    token.name = dbUser.name;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.uid;
                session.user.role = token.role;
                if (token.name) session.user.name = token.name;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };