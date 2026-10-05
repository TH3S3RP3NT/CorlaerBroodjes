// Pauzetijden en bestelvenster. De database kent (nog) geen pauzetabel, daarom komen de
// tijden uit environment variables:
//   BREAK_TIMES=10:15,12:45        (HH:MM, Europe/Amsterdam, in volgorde van de dag)
//   ORDER_LEAD_MINUTES=10          (hoeveel minuten voor de pauze het bestellen sluit)
// De standaardwaarden hieronder zijn PLAATSHOUDERS: stel de echte tijden van het Corlaer in.

export const TIME_ZONE = "Europe/Amsterdam";

export type BreakSlot = { index: number; name: string; start: string };

const DEFAULT_BREAK_TIMES = "10:15,12:45";
const ORDINALS = ["1e pauze", "2e pauze", "3e pauze", "4e pauze"];

export function getBreaks(): BreakSlot[] {
    const raw = process.env.BREAK_TIMES ?? DEFAULT_BREAK_TIMES;
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter((s) => /^\d{1,2}:\d{2}$/.test(s))
        .map((s, index) => {
            const [h, m] = s.split(":");
            return {
                index,
                name: ORDINALS[index] ?? `${index + 1}e pauze`,
                start: `${h.padStart(2, "0")}:${m}`,
            };
        });
}

export function orderLeadMinutes(): number {
    const n = Number(process.env.ORDER_LEAD_MINUTES ?? "10");
    return Number.isFinite(n) && n >= 0 ? n : 10;
}

function partsInZone(date: Date): Record<string, number> {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: TIME_ZONE,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    const result: Record<string, number> = {};
    for (const part of formatter.formatToParts(date)) {
        if (part.type !== "literal") {
            result[part.type] = Number(part.value);
        }
    }
    return result;
}

function zoneOffsetMs(date: Date): number {
    const p = partsInZone(date);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

// Het moment (als echte UTC-instant) waarop de gekozen pauze vandaag begint, in Nederlandse tijd.
export function pickupInstant(slot: BreakSlot, now: Date = new Date()): Date {
    const p = partsInZone(now);
    const [h, m] = slot.start.split(":").map(Number);
    const guess = Date.UTC(p.year, p.month - 1, p.day, h, m);
    return new Date(guess - zoneOffsetMs(new Date(guess)));
}
