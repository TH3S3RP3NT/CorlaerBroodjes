"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
        <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
          <h1>Welcome, {session.user?.name}!</h1>
          <p>Email: {session.user?.email}</p>
          {session.user?.image && (
              <img
                  src={session.user.image}
                  alt="Profile"
                  style={{ borderRadius: "50%", width: "80px" }}
              />
          )}
          <br /><br />
          <button onClick={() => signOut()}>Sign out</button>
        </main>
    );
  }

  return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Next.js Google Auth Test</h1>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </main>
  );
}