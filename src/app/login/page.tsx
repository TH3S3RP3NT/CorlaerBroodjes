"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginCard() {
    const searchParams = useSearchParams();
    const requestedCallback = searchParams.get("callbackUrl");
    const callbackUrl =
        requestedCallback?.startsWith("/") && !requestedCallback.startsWith("//")
            ? requestedCallback
            : "/";

    return (
        <section className="auth-card" aria-labelledby="login-title">
            <span className="auth-card__mark">CorlaerBroodjes</span>
            <h1 id="login-title">Welkom terug</h1>
            <p>Log in met je Corlaer-account om broodjes te bestellen en je bestellingen te bekijken.</p>
            <button
                className="auth-card__button"
                type="button"
                onClick={() => signIn("google", { callbackUrl })}
            >
                <svg className="auth-card__google-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M21.35 12.23c0-.78-.07-1.53-.2-2.25H12v4.26h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.4Z" />
                    <path fill="#34A853" d="M12 21.75c2.63 0 4.84-.87 6.45-2.37l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.75 9.75 0 0 0 12 21.75Z" />
                    <path fill="#FBBC05" d="M6.53 13.82a5.86 5.86 0 0 1 0-3.64V7.65H3.28a9.75 9.75 0 0 0 0 8.7l3.25-2.53Z" />
                    <path fill="#EA4335" d="M12 6.15c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.23 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.4l3.25 2.53C7.3 7.87 9.46 6.15 12 6.15Z" />
                </svg>
                Inloggen met Google
            </button>
        </section>
    );
}

export default function LoginPage() {
    return (
        <main className="auth-page">
            <Suspense>
                <LoginCard />
            </Suspense>
        </main>
    );
}
