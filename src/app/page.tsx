"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
                <p>Laden...</p>
            </main>
        );
    }

    if (session) {
        return (
            <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
                <h1>Welkom, {session.user?.name}!</h1>

                {session.user?.image && (
                    <img
                        src={session.user.image}
                        alt="Profile"
                        style={{ borderRadius: "50%", width: "80px", marginBottom: "1rem" }}
                    />
                )}

                <div style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px", maxWidth: "400px" }}>
                    <p><strong>ID:</strong> {session.user?.id}</p>
                    <p><strong>Naam:</strong> {session.user?.name}</p>
                    <p><strong>E-mail:</strong> {session.user?.email}</p>
                    <p><strong>Rol:</strong> {session.user?.role}</p>
                </div>

                <br />
                <button onClick={() => signOut()}>Uitloggen</button>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Kantine App Auth Test</h1>
            <button onClick={() => signIn("google")}>Inloggen met Google</button>
        </main>
    );
}