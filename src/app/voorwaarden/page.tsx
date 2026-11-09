import Link from 'next/link';

export default function VoorwaardenPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <article className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200">
                <header className="mb-10 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                        Algemene Voorwaarden
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        CorlaerBroodjes • Laatst gewijzigd: November 2026
                    </p>
                </header>

                <section className="space-y-8 text-gray-700 leading-relaxed">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 1. Definities
                        </h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>
                                <strong>CorlaerBroodjes:</strong> Het online bestelplatform voor het bestellen van kantinebroodjes via corlaerbroodjes.nl.
                            </li>
                            <li>
                                <strong>Klant / Gebruiker:</strong> De natuurlijke persoon (leerling, docent of medewerker) die gebruikmaakt van het platform om bestellingen te plaatsen.
                            </li>
                            <li>
                                <strong>Bestelling:</strong> De overeenkomst tussen de klant en CorlaerBroodjes voor de bereiding en levering (ophaal) van een of meer producten.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 2. Toepasselijkheid
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Deze algemene voorwaarden zijn van toepassing op elk aanbod, elke bestelling en elke overeenkomst die tot stand komt via het platform van CorlaerBroodjes.</li>
                            <li>Door een bestelling te plaatsen, gaat de klant akkoord met de inhoud van deze algemene voorwaarden.</li>
                        </ol>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 3. Aanbod en Bestelling
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Het aanbod op het platform bevat een overzicht van de beschikbare broodjes en producten met bijbehorende prijzen.</li>
                            <li>Bestellingen worden geplaatst via de website door een product te kiezen en een ophaalmoment te selecteren.</li>
                            <li>Een bestelling is definitief zodra deze via het systeem is bevestigd.</li>
                        </ol>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 4. Prijzen en Betaling
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Alle vermelde prijzen zijn in euro&apos;s (€) en inclusief btw.</li>
                            <li>Betaling vindt plaats volgens de op het platform aangeboden betalingsmethoden of bij het afhalen, afhankelijk van de ingestelde opties op het moment van bestellen.</li>
                        </ol>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 5. Afhalen en Wachttijden
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>De klant is zelf verantwoordelijk voor het tijdig ophalen van de bestelling op het gekozen ophaaltijdstip bij de afgesproken locatie in de kantine.</li>
                            <li>Indien de klant de bestelling niet of te laat ophaalt, blijft de betalingsverplichting bestaan. Vanwege de beperkte houdbaarheid van verse voedingsmiddelen worden niet-opgehaalde bestellingen niet vergoed.</li>
                            <li>De aangegeven wachttijden en ophaalmomenten zijn indicatief; CorlaerBroodjes streeft er naar de bestelling op het afgesproken moment klaar te hebben staan.</li>
                        </ol>
                    </div>


                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 6. Annuleren en Herroepingsrecht
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                Omdat het gaat om de levering van verse, snel bederfelijke etenswaren, is het <strong>wettelijk herroepingsrecht (bedenktijd) niet van toepassing</strong> (art. 7:46c lid 1 sub f BW).
                            </li>
                            <li>Annuleren van een bestelling is enkel mogelijk zolang de bereiding van de bestelling nog niet is gestart.</li>
                        </ol>
                    </div>


                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 7. Allergieën en Voedselveiligheid
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Producten worden vers bereid. Bij specifieke allergenen of dieetwensen dient de klant de informatie bij het product zorgvuldig te controleren.</li>
                            <li>CorlaerBroodjes is niet aansprakelijk voor allergische reacties indien de ingrediënten en allergeneninformatie naar behoren zijn vermeld.</li>
                        </ol>
                    </div>


                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 8. Privacy
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Persoonsgegevens worden uitsluitend verwerkt ter afhandeling van de bestelling en voor de werking van het platform.</li>
                            <li>
                                Voor uitgebreide informatie over de omgang met persoonsgegevens verwijzen wij naar ons{' '}
                                <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                                    Privacybeleid
                                </Link>.
                            </li>
                        </ol>
                    </div>


                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 9. Klachten en Contact
                        </h2>
                        <p>
                            Heb je een vraag, opmerking of klacht over een bestelling? Neem dan direct contact op met het kantineteam of stuur een bericht via het platform. Klachten dienen zo snel mogelijk na afhalen te worden gemeld.
                        </p>
                    </div>


                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Artikel 10. Wijzigingen
                        </h2>
                        <p>
                            CorlaerBroodjes behoudt zich het recht voor deze algemene voorwaarden op elk moment te wijzigen. De versie die geldt op het moment van bestellen is steeds van toepassing.
                        </p>
                    </div>
                </section>

                <footer className="mt-12 pt-6 border-t border-gray-200 text-center sm:text-left">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        ← Terug naar home
                    </Link>
                </footer>
            </article>
        </main>
    );
}