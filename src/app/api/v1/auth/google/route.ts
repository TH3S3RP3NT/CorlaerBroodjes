import { createRemoteJWKSet, jwtVerify } from "jose";
import { db } from "@/db";
import { users } from "@/db/schema";
import { formatName, extractUserIdFromEmail } from "@/lib/utils";
import { issueAppToken, jsonError } from "@/lib/api";
import { userDto } from "@/lib/dto";

// POST /api/v1/auth/google   body: { "idToken": "<Google ID-token van de iOS-app>" }
// Controleert het ID-token bij Google, past dezelfde domeinregels toe als de webapp en
// geeft een app-token terug dat als "Authorization: Bearer" wordt meegestuurd.

const GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export async function POST(request: Request) {
    const audience = process.env.GOOGLE_IOS_CLIENT_ID;
    if (!audience) {
        console.error("[api/v1/auth] GOOGLE_IOS_CLIENT_ID is niet ingesteld");
        return jsonError(500, "serverfout", "Inloggen is nu niet beschikbaar.");
    }

    let idToken: unknown;
    try {
        const body = await request.json();
        idToken = (body as { idToken?: unknown })?.idToken;
    } catch {
        idToken = undefined;
    }
    if (typeof idToken !== "string" || idToken.length === 0) {
        return jsonError(400, "ongeldige_invoer", "Het inlogverzoek is niet geldig.");
    }

    let claims: Record<string, unknown>;
    try {
        const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
            issuer: ["https://accounts.google.com", "accounts.google.com"],
            audience,
        });
        claims = payload as Record<string, unknown>;
    } catch {
        return jsonError(401, "ongeldig_token", "Inloggen met Google is mislukt. Probeer het opnieuw.");
    }

    const sub = typeof claims.sub === "string" ? claims.sub : null;
    const email = typeof claims.email === "string" ? claims.email.toLowerCase() : null;
    if (!sub || !email || claims.email_verified !== true) {
        return jsonError(401, "ongeldig_token", "Inloggen met Google is mislukt. Probeer het opnieuw.");
    }

    // Zelfde regels als de webapp: personeel- en leerlingdomein, anders geweigerd.
    let role: "LEERLING" | "PERSONEEL";
    if (email.endsWith("@lln.corlaercollege.nl")) {
        role = "LEERLING";
    } else if (email.endsWith("@corlaercollege.nl")) {
        role = "PERSONEEL";
    } else {
        return jsonError(403, "domein_geweigerd", "Log in met je schoolaccount van het Corlaer College.");
    }

    const name = formatName(typeof claims.name === "string" ? claims.name : "Onbekende gebruiker");
    const avatarUrl = typeof claims.picture === "string" ? claims.picture : null;

    try {
        const [user] = await db
            .insert(users)
            .values({
                id: extractUserIdFromEmail(email),
                googleId: sub,
                email,
                name,
                avatarUrl,
                role,
            })
            .onConflictDoUpdate({
                target: users.googleId,
                set: { name, avatarUrl },
            })
            .returning();

        const { token, expiresAt } = await issueAppToken(user.id);
        return Response.json({ token, expiresAt: expiresAt.toISOString(), user: userDto(user) });
    } catch (error) {
        console.error("[api/v1/auth] Fout tijdens opslaan:", error);
        return jsonError(500, "serverfout", "Er ging iets mis bij het inloggen. Probeer het later opnieuw.");
    }
}
