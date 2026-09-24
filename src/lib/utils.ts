export function formatName(rawName: string): string {
    if (!rawName || !rawName.includes(",")) return rawName;

    const [namePart, tussenvoegsel] = rawName.split(",").map((s) => s.trim());

    if (!tussenvoegsel) return namePart;

    const words = namePart.split(" ");


    if (words.length > 1) {
        const achternaam = words.pop();
        const voornaam = words.join(" ");

        return `${voornaam} ${tussenvoegsel} ${achternaam}`;
    }

    return `${tussenvoegsel} ${namePart}`;
}

export function extractUserIdFromEmail(email: string): string {
    if (!email || !email.includes("@")) return "";
    return email.split("@")[0].toLowerCase().trim();
}