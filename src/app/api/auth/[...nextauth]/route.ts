import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatName } from "@/lib/utils";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (
                account?.provider === "google" &&
                profile &&
                profile.sub &&
                user.email
            ) {
                try {

                    const googleId: string = profile.sub;
                    const email: string = user.email;
                    const rawName = user.name || "Onbekende gebruiker";
                    const formattedName = formatName(rawName);
                    const avatarUrl = user.image || null;


                    let role: "LEERLING" | "PERSONEEL" = "LEERLING";

                    if (email.endsWith("@corlaercollege.nl")) {
                        role = "PERSONEEL";
                    } else if (email.endsWith("@lln.corlaercollege.nl")) {
                        role = "LEERLING";
                    } else {
                        console.warn(`Inlogpoging GEWEIGERD voor domein: ${email}`);
                        return false;
                    }


                    const existingUser = await db
                        .select()
                        .from(users)
                        .where(eq(users.googleId, googleId))
                        .limit(1);


                    if (existingUser.length === 0) {
                        await db.insert(users).values({
                            googleId,
                            email,
                            name: formattedName,
                            avatarUrl,
                            role,
                        });
                    } else {
                        await db
                            .update(users)
                            .set({ name: formattedName, avatarUrl, role })
                            .where(eq(users.googleId, googleId));
                    }

                    return true;
                } catch (error) {
                    console.error("Fout bij opslaan van gebruiker in DB:", error);
                    return false;
                }
            }
            return false;
        },

        async session({ session }) {
            if (session.user?.email) {
                const email: string = session.user.email;

                const dbUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .limit(1);

                if (dbUser.length > 0) {
                    const customUser = session.user as unknown as {
                        id: number;
                        role: "LEERLING" | "PERSONEEL" | "ADMIN";
                    };
                    customUser.id = dbUser[0].id;
                    customUser.role = dbUser[0].role;
                }
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };