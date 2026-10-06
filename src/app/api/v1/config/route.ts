import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { locations } from "@/db/schema";
import { authenticate, jsonError } from "@/lib/api";
import { TIME_ZONE, getBreaks, isSchoolDay, orderLeadMinutes } from "@/lib/schedule";

// Pauzetijden (voor de bestel-timer), bestelvenster, actieve ophaallocaties en servertijd.
export async function GET(request: Request) {
    const auth = await authenticate(request);
    if (!auth.ok) return auth.response;

    try {
        const activeLocations = await db
            .select({ id: locations.id, name: locations.name })
            .from(locations)
            .where(eq(locations.isActive, true))
            .orderBy(asc(locations.name));

        return Response.json({
            timeZone: TIME_ZONE,
            serverTime: new Date().toISOString(),
            orderLeadMinutes: orderLeadMinutes(),
            ordersOpen: isSchoolDay(),
            breaks: getBreaks(),
            locations: activeLocations,
        });
    } catch (error) {
        console.error("[api/v1/config]", error);
        return jsonError(500, "serverfout", "De gegevens konden niet worden geladen.");
    }
}
