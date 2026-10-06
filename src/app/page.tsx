import Link from "next/link";

const benefits = [
    {
        title: "Vers bereid",
        description: "Broodjes worden met zorg klaargemaakt, precies zoals jij ze lekker vindt.",
    },
    {
        title: "Snel geregeld",
        description: "Bestel vooraf en haal je lunch op wanneer het jou uitkomt.",
    },
    {
        title: "Geen wachtrij",
        description: "Bekijk je bestelling en de verwachte wachttijd op een overzichtelijke plek.",
    },
];

export default function Home() {
    return (
        <main>
            <section className="hero">
                <div className="hero__content">
                    <p className="eyebrow">De kantine, maar dan makkelijker</p>
                    <h1>Een lekker broodje binnen handbereik.</h1>
                    <p className="hero__intro">
                        Bestel eenvoudig je favoriete broodje en haal het op wanneer het
                        klaarstaat. Zo houd je meer tijd over voor wat echt belangrijk is.
                    </p>
                    <div className="hero__actions">
                        <Link className="button-link" href="#hoe-werkt-het">
                            Hoe werkt het?
                        </Link>
                        <Link className="button-link button-link--secondary" href="/profile">
                            Mijn bestellingen
                        </Link>
                    </div>
                </div>
                <div className="hero__highlight" aria-label="Vandaag in de kantine">
                    <span className="hero__highlight-label">Vandaag in de kantine</span>
                    <strong>Vers. Snel. Lekker.</strong>
                    <span>Jouw lunch geregeld zonder gedoe.</span>
                </div>
            </section>

            <section className="benefits" aria-labelledby="voordelen-title">
                <div className="section-heading">
                    <p className="eyebrow">Waarom CorlaerBroodjes?</p>
                    <h2 id="voordelen-title">Jouw pauze begint hier</h2>
                </div>
                <div className="benefits__grid">
                    {benefits.map((benefit, index) => (
                        <article className="benefit-card" key={benefit.title}>
                            <span className="benefit-card__number">0{index + 1}</span>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="how-it-works" id="hoe-werkt-het" aria-labelledby="how-title">
                <div className="section-heading">
                    <p className="eyebrow">Zo werkt het</p>
                    <h2 id="how-title">In drie simpele stappen</h2>
                </div>
                <ol className="steps">
                    <li>
                        <strong>Kies je broodje</strong>
                        <span>Bekijk het aanbod en kies waar je zin in hebt.</span>
                    </li>
                    <li>
                        <strong>Plan je ophaalmoment</strong>
                        <span>Geef aan wanneer je jouw bestelling wilt ophalen.</span>
                    </li>
                    <li>
                        <strong>Haal het op</strong>
                        <span>Je bestelling staat voor je klaar op de afgesproken plek.</span>
                    </li>
                </ol>
            </section>
        </main>
    );
}
