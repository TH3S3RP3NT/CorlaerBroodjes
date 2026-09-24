// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatName, extractUserIdFromEmail } from "@/lib/utils";


export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
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
                    const email: string = user.email;
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
                                role,
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

        async session({ session }) {
            if (session.user?.email) {
                try {
                    const dbUsers = await db
                        .select()
                        .from(users)
                        .where(eq(users.email, session.user.email))
                        .limit(1);

                    if (dbUsers.length > 0) {
                        session.user.id = dbUsers[0].id;
                        session.user.name = dbUsers[0].name;
                        session.user.role = dbUsers[0].role;
                    }
                } catch (error) {
                    console.error("[NextAuth] Session callback fout:", error);
                }
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };