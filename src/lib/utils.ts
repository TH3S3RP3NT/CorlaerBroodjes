export function formatName(rawName: string): string {
    if (!rawName || !rawName.includes(",")) return rawName;

    // Splits op de komma:
    // "Jan Plas, van der" -> namePart = "Jan Plas", tussenvoegsel = "van der"
    const [namePart, tussenvoegsel] = rawName.split(",").map((s) => s.trim());

    if (!tussenvoegsel) return namePart;

    const words = namePart.split(" ");

    // Als er minimaal een voornaam en achternaam staan vóór de komma (bijv. ["Jan", "Plas"])
    if (words.length > 1) {
        const achternaam = words.pop(); // Haalt "Plas" eruit
        const voornaam = words.join(" "); // De rest is "Jan" (of bijv. "Jan Willem")

        // Voeg alles samen in de natuurlijke volgorde: "Jan van der Plas"
        return `${voornaam} ${tussenvoegsel} ${achternaam}`;
    }

    // Mocht er maar 1 woord voor de komma staan (bijv. "Plas, van der")
    return `${tussenvoegsel} ${namePart}`;
}