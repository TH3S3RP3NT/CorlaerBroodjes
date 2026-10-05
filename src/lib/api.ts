import { decode, encode } from "next-auth/jwt";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

// Gedeelde helpers voor de JSON-API (/api/v1) die door de iOS-app wordt gebruikt.
// Authenticatie: de app stuurt "Authorization: Bearer <token>". Dat token wordt uitgegeven
// door POST /api/v1/auth/google nadat een Google ID-token is gecontroleerd.

export const APP_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 dagen

export type DbUser = typeof users.$inferSelect;

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string
    ) {
        super(message);
    }
}

export function jsonError(status: number, code: string, message: string): Response {
    return Response.json({ error: { code, message } }, { status });
}

function getSecret(): string {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
        throw new Error("NEXTAUTH_SECRET is niet ingesteld");
    }
    return secret;
}

export async function issueAppToken(userId: string): Promise<{ token: string; expiresAt: Date }> {
    const token = await encode({
        token: { sub: userId, kind: "app" },
        secret: getSecret(),
        maxAge: APP_TOKEN_MAX_AGE_SECONDS,
    });
    return { token, expiresAt: new Date(Date.now() + APP_TOKEN_MAX_AGE_SECONDS * 1000) };
}

export type AuthResult =
    | { ok: true; user: DbUser }
    | { ok: false; response: Response };

export async function authenticate(request: Request): Promise<AuthResult> {
    const header = request.headers.get("authorization") ?? "";
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
        return { ok: false, response: jsonError(401, "niet_ingelogd", "Je bent niet ingelogd.") };
    }

    let payload: Awaited<ReturnType<typeof decode>> = null;
    try {
        payload = await decode({ token: match[1], secret: getSecret() });
    } catch {
        payload = null;
    }

    // "kind" voorkomt dat een gewoon web-sessietoken als app-token wordt geaccepteerd.
    if (!payload || payload.kind !== "app" || typeof payload.sub !== "string") {
        return {
            ok: false,
            response: jsonError(401, "sessie_verlopen", "Je sessie is verlopen. Log opnieuw in."),
        };
    }

    const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
    if (!user) {
        return {
            ok: false,
            response: jsonError(401, "sessie_verlopen", "Je sessie is verlopen. Log opnieuw in."),
        };
    }

    return { ok: true, user };
}
