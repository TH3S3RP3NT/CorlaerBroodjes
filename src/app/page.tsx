"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { sendTestEmail } from "@/app/actions/sendTestEmail";

export default function Home() {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const handleSendEmail = async () => {
        setLoading(true);
        setStatusMessage(null);

        const result = await sendTestEmail();

        setStatusMessage(result.message);
        setLoading(false);
    };

    if (status === "loading") {
        return <main style={{ padding: "2rem" }}>Laden...</main>;
    }

    if (session) {
        return (
            <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
                <h1>Welkom, {session.user?.name}!</h1>

                <div style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "8px", maxWidth: "400px" }}>
                    <p><strong>ID:</strong> {session.user?.id}</p>
                    <p><strong>E-mail:</strong> {session.user?.email}</p>
                    <p><strong>Rol:</strong> {session.user?.role}</p>
                </div>

                <br />

                {/* Testknop voor e-mail */}
                <button
                    onClick={handleSendEmail}
                    disabled={loading}
                    style={{
                        padding: "10px 16px",
                        backgroundColor: "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Bezig met verzenden..." : `Stuur testmail naar ${session.user?.email}`}
                </button>

                {statusMessage && (
                    <p style={{ marginTop: "1rem", color: statusMessage.includes("succesvol") ? "green" : "red" }}>
                        {statusMessage}
                    </p>
                )}

                <br /><br />
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