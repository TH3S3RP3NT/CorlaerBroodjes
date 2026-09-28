"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTestEmail() {
    const session = await getServerSession(authOptions);

    // 1. Controleer of de gebruiker ingelogd is en een e-mailadres heeft
    if (!session || !session.user?.email) {
        return { success: false, message: "Niet ingelogd of geen e-mailadres gevonden." };
    }

    const recipientEmail = session.user.email;
    const userName = session.user.name || "Gebruiker";

    try {
        const data = await resend.emails.send({
            from: "CorlaerBroodjes <noreply@corlaerbroodjes.nl>",
            replyTo: "info@corlaerbroodjes.nl",
            to: [recipientEmail],
            subject: "Test e-mail vanuit de Kantine App",
            html: `
        <h1>Hallo ${userName},</h1>
        <p>Dit is een test e-mail vanuit het kantine bestelsysteem!</p>
        <p><strong>Jouw account ID:</strong> ${session.user.id || "Onbekend"}</p>
        <p>Als je dit ontvangt, werkt de e-mailintegratie correct.</p>
      `,
        });

        return { success: true, message: `Testmail succesvol verzonden naar ${recipientEmail}!` };
    } catch (error) {
        console.error("Fout bij het versturen van e-mail:", error);
        return { success: false, message: "Er is iets misgegaan bij het versturen van de mail." };
    }
}