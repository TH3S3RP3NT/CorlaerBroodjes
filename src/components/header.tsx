import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 2rem",
                backgroundColor: "#1e293b",
                color: "white",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                <Link href="/" style={{ fontSize: "1.25rem", fontWeight: "bold", color: "white", textDecoration: "none" }}>
                    CorlaerBroodjes
                </Link>
                <nav style={{ display: "flex", gap: "1rem" }}>
                    <Link href="/products" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                        Menu & Bestellen
                    </Link>
                    {session && (
                        <Link href="/profile" style={{ color: "#cbd5e1", textDecoration: "none" }}>
                            Mijn Profiel
                        </Link>
                    )}
                    {session?.user?.role === "ADMIN" && (
                        <Link
                            href="/admin"
                            style={{
                                color: "#f87171",
                                fontWeight: "bold",
                                textDecoration: "none",
                                background: "rgba(248, 113, 113, 0.1)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                            }}
                        >
                            Admin Dashboard
                        </Link>
                    )}
                </nav>
            </div>

            <div>
                {session ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
              {session.user.name} ({session.user.role})
            </span>
                        <Link
                            href="/api/auth/signout"
                            style={{
                                fontSize: "0.85rem",
                                color: "white",
                                background: "#334155",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                textDecoration: "none",
                            }}
                        >
                            Uitloggen
                        </Link>
                    </div>
                ) : (
                    <Link
                        href="/api/auth/signin"
                        style={{
                            fontSize: "0.9rem",
                            color: "white",
                            background: "#2563eb",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Inloggen
                    </Link>
                )}
            </div>
        </header>
    );
}