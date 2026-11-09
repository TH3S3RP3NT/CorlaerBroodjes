import React from 'react';
import Link from "next/link";

export const metadata = {
    title: 'Privacyverklaring | Corlaer Broodjes',
    description: 'Privacyverklaring voor de kantine-bestel- en afhaalsysteem applicatie van het Corlaer College.',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-6">
                    Privacyverklaring Corlaer Broodjes
                </h1>

                <div className="space-y-6 text-sm sm:text-base leading-relaxed">
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg text-xs sm:text-sm border border-gray-100">
                        <div><strong>Laatst bijgewerkt:</strong> 9 november 2026</div>
                        <div><strong>Applicatie:</strong> Corlaer Broodjes (Kantine Web- & iOS-App)</div>
                        <div><strong>Domein:</strong> corlaerbroodjes.nl</div>
                        <div><strong>Ontwikkelaars:</strong> {process.env.LLN} (Klas A6in1, Begeleider: {process.env.BGL})</div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Wie zijn wij?</h2>
                        <p>
                            Corlaer Broodjes is een kantine-bestel- en afhaalsysteem ontwikkeld voor leerlingen en medewerkers van het Corlaer College. Met deze applicatie kun je vooraf je lunch bestellen en afrekenen om lange wachttijden in de pauze te voorkomen.
                        </p>
                        <p className="mt-2">
                            Omdat onze gebruikers grotendeels scholieren zijn, vinden wij jouw privacy extra belangrijk. Deze verklaring legt in begrijpelijke taal uit wat we met jouw gegevens doen. Voor vragen over privacy en gegevensverwerking kun je contact opnemen met het projectteam via de schoolomgeving van begeleider {process.env.BGL} (<Link href={"{process.env.BGLM}"} className="text-blue-600 hover:underline font-medium">{process.env.BGLMAIL}</Link>) of via het e-mailadres van het project (<Link href="mailto:info@corlaerbroodjes.nl" className="text-blue-600 hover:underline font-medium">info@corlaercollege.nl</Link>).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Gebruik door minderjarigen (onder de 16 jaar)</h2>
                        <p>
                            Ben je jonger dan 16 jaar? Dan gaan wij ervan uit dat je ouders of wettelijke verzorgers op de hoogte zijn van het gebruik van deze applicatie. Omdat je inlogt via jouw officiële schoolaccount van het Corlaer College, is de toegang gekoppeld aan de algemene privacyovereenkomst van de school.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Welke persoonsgegevens verwerken wij?</h2>
                        <p className="mb-4">
                            Wij verwerken uitsluitend algemene gegevens die strikt noodzakelijk zijn voor het functioneren van de applicatie, het verwerken van bestellingen en de identificatie bij het ophalen. Wij verwerken <strong>GEEN</strong> bijzondere persoonsgegevens (zoals medische gegevens of allergieën).
                        </p>

                        <div className="space-y-3 pl-4 border-l-2 border-orange-500">
                            <div>
                                <h3 className="font-semibold text-gray-900">Account- en Profielgegevens (via Google OAuth 2.0)</h3>
                                <p className="text-sm text-gray-600">Wanneer je inlogt met je schoolaccount, importeren en bewaren wij:</p>
                                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                                    <li>Volledige naam (om te tonen op bonnen en afhaaloverzichten)</li>
                                    <li>E-mailadres (voor accountidentificatie en updates over je bestelling)</li>
                                    <li>Profielfoto URL (voor avatarweergave binnen het platform)</li>
                                    <li>Unieke Google ID (om je account veilig te koppelen)</li>
                                    <li>Gebruikersrol (Leerling, Kantinepersoneel of Admin)</li>
                                </ul>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-900">Bestel- en Transactiegegevens</h3>
                                <p className="text-sm text-gray-600">Wanneer je een bestelling plaatst, registreren wij:</p>
                                <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                                    <li>Bestelde producten, aantallen en prijzen</li>
                                    <li>Gekozen ophaallocatie en ophaaltijdstip</li>
                                    <li>Transactiestatus en SumUp Transactie ID (wij slaan zelf GEEN bank- of creditcardgegevens op)</li>
                                    <li>Kluisnummer & Scangegevens (bij uitgifte via de fysieke kluis en scanner)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Waarvoor gebruiken wij deze gegevens?</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><strong>Authenticatie & Accountbeheer:</strong> Veilig inloggen via Google OAuth 2.0 en het beheren van gebruikersrollen.</li>
                            <li><strong>Bestelverwerking en Afhandeling:</strong> Het doorsturen van bestellingen naar het kantinedashboard en het toewijzen van de juiste kluis of afhaallocatie.</li>
                            <li><strong>Meldingen & Status-updates:</strong> Om je te laten weten wanneer een bestelling gereed is.</li>
                            <li><strong>Betalingen:</strong> Het koppelen van de betaling aan jouw bestelling via de SumUp API.</li>
                            <li><strong>Vraagprognoses:</strong> Het genereren van geanonimiseerde statistieken voor het kantinepersoneel om voedselverspilling te verminderen.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Grondslag voor de verwerking (AVG)</h2>
                        <p className="mb-2">Wij verwerken jouw gegevens op basis van de volgende juridische grondslagen uit de wet (AVG):</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Uitvoering van een overeenkomst:</strong> De verwerking is noodzakelijk om het broodje dat je koopt correct te bereiden, te betalen en af te leveren.</li>
                            <li><strong>Gerechtvaardigd belang:</strong> Het optimaliseren van de kantinevoorraad en het verminderen van wachtrijen op school.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Delen van gegevens met derden</h2>
                        <p className="mb-4">Wij verkopen of verhuren jouw persoonsgegevens nooit. Gegevens worden alleen gedeeld met partijen die strikt noodzakelijk zijn voor de technische en financiële werking van de app:</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="p-3 font-semibold text-gray-700">Ontvanger/verwerker</th>
                                    <th className="p-3 font-semibold text-gray-700">Doel van verwerking</th>
                                    <th className="p-3 font-semibold text-gray-700">Beveiligingsmaatregel</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-150">
                                <tr>
                                    <td className="p-3 font-medium">Google OAuth 2.0</td>
                                    <td className="p-3">Inlogverificatie via schoolaccount</td>
                                    <td className="p-3">Beveiligde OAuth-tokens</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">SumUp</td>
                                    <td className="p-3">Verwerking van de online betaling</td>
                                    <td className="p-3">Beveiligde REST API & Webhooks</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Supabase / PostgreSQL</td>
                                    <td className="p-3">Hosting van de database</td>
                                    <td className="p-3">Gegevensopslag achter beveiligde verbinding</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-medium">Vercel</td>
                                    <td className="p-3">Hosting van de webapplicatie (Next.js)</td>
                                    <td className="p-3">HTTPS / TLS 1.3 versleuteling</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Beveiliging van jouw gegevens</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>HTTPS (TLS 1.3):</strong> Alle communicatie tussen jouw apparaat en onze server is volledig versleuteld.</li>
                            <li><strong>Databasebeveiliging:</strong> Queries worden veilig uitgevoerd via Drizzle ORM met prepared statements om SQL-injection te voorkomen.</li>
                            <li><strong>App-beveiliging:</strong> Formulieren zijn beveiligd tegen Cross-Site Scripting (XSS) en Cross-Site Request Forgery (CSRF).</li>
                            <li><strong>Toegangsbeheer:</strong> Kantinepersoneel ziet uitsluitend de gegevens die nodig zijn voor het maken en uitgeven van de actuele bestellingen.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Bewaartermijnen</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Accountgegevens:</strong> Blijven bewaard zolang je actief gebruikmaakt van de applicatie of ingeschreven staat op het Corlaer College.</li>
                            <li><strong>Bestel- en Transactiehistorie:</strong> Worden na afloop van elk schooljaar volledig geanonimiseerd of verwijderd, tenzij de wet een langere bewaartermijn vereist voor de financiële administratie (SumUp-transacties).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Jouw rechten (AVG)</h2>
                        <p className="mb-2">Je hebt het wettelijke recht om:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Jouw gegevens in te zien (dit kan ook direct via je accountpagina in de app).</li>
                            <li>Onjuiste gegevens te laten corrigeren.</li>
                            <li>Jouw gegevens en account volledig te laten verwijderen (Recht op vergetelheid).</li>
                            <li>Bezwaar te maken tegen een bepaalde verwerking.</li>
                        </ul>
                        <p className="mt-2 text-sm text-gray-600">
                            Wil je gebruikmaken van je rechten? Stuur dan een bericht naar het projectteam of de beheerders via de schoolomgeving.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Cookies en Lokale Opslag</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Noodzakelijke cookies/sessies:</strong> Wij gebruiken uitsluitend functionele cookies en beveiligde sessie-tokens (NextAuth.js) om je ingelogd te houden en je winkelmandje te onthouten.</li>
                            <li><strong>Geen tracking:</strong> Wij gebruiken geen marketingcookies, trackingsoftware of advertentienetwerken.</li>
                        </ul>
                    </section>

                    <section className="border-t pt-4 text-xs sm:text-sm text-gray-500">
                        <h2 className="font-semibold text-gray-700 mb-1">Wijzigingen in deze Privacyverklaring</h2>
                        <p>
                            Dit privacybeleid kan veranderen als de wetgeving of onze app wijzigt. De actuele versie is altijd te vinden op <Link href={"/privacy"} className="text-blue-600 hover:underline font-medium">corlaerbroodjes.nl/privacy</Link>.
                        </p>
                    </section>
                </div>
                <footer className="mt-12 pt-6 border-t border-gray-200 text-center sm:text-left">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        ← Terug naar home
                    </Link>
                </footer>
            </div>
        </div>
    );
}
