import Link from "next/link";

export default function NotFound() {
    return (
        <main className="not-found-page">
            <section className="not-found-card" aria-labelledby="not-found-title">
                <span className="not-found-card__code">Fout 404</span>
                <h1 id="not-found-title">Pagina niet gevonden</h1>
                <p>Deze pagina bestaat niet of is verplaatst. Ga terug naar de startpagina om verder te gaan.</p>
                <div className="not-found-card__actions">
                    <Link className="button-link" href="/">
                        Naar de startpagina
                    </Link>
                </div>
            </section>
        </main>
    );
}
