"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export function Header() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="site-header">
            <div className="site-header__inner">
                <Link className="site-header__brand" href="/">
                    CorlaerBroodjes
                </Link>

                <nav className="site-header__nav" aria-label="Hoofdnavigatie">
                    <Link href="/">Home</Link>
                    <Link href="/products">Producten</Link>
                </nav>

                <div className="site-header__account">
                    {status === "loading" ? (
                        <span className="site-header__status">Laden...</span>
                    ) : session ? (
                        <div className="profile-menu">
                            <button
                                className="profile-menu__trigger"
                                aria-expanded={menuOpen}
                                aria-haspopup="menu"
                                aria-label="Accountmenu openen"
                                onClick={() => setMenuOpen((open) => !open)}
                            >
                                {session.user?.image ? (
                                    <Image
                                        className="profile-menu__avatar"
                                        src={session.user.image}
                                        alt=""
                                        width={40}
                                        height={40}
                                    />
                                ) : (
                                    <span className="profile-menu__initials">
                                        {(session.user?.name || session.user?.email || "?")
                                            .slice(0, 1)
                                            .toUpperCase()}
                                    </span>
                                )}
                                <span className="profile-menu__chevron" aria-hidden="true">
                                    {menuOpen ? "▴" : "▾"}
                                </span>
                            </button>
                            {menuOpen && (
                                <div className="profile-menu__dropdown" role="menu">
                                    <div className="profile-menu__identity">
                                        <strong>{session.user?.name || "Mijn account"}</strong>
                                        <span>{session.user?.email}</span>
                                    </div>
                                    <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                                        Mijn profiel
                                    </Link>
                                    {session.user?.role === "ADMIN" && (
                                        <Link href="/admin" role="menuitem" onClick={() => setMenuOpen(false)}>
                                            Admin dashboard
                                        </Link>
                                    )}
                                    <button
                                        className="profile-menu__logout"
                                        role="menuitem"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        Uitloggen
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link className="site-header__button" href="/login">
                            Inloggen
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
