import { Resend } from "resend";
import type { OrderWithRelations } from "@/lib/dto";

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getResend(): Resend | null {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("[email] RESEND_API_KEY is not configured; skipping email.");
        return null;
    }
    return new Resend(apiKey);
}

export async function sendOrderConfirmationEmail(
    recipient: string,
    order: OrderWithRelations,
): Promise<void> {
    const resend = getResend();
    const from = process.env.EMAIL_FROM;
    const replyTo = process.env.EMAIL_REPLY_TO;
    if (!resend || !from || !replyTo) {
        if (!from) {
            console.warn("[email] EMAIL_FROM is not configured; skipping email.");
        }
        if (!replyTo) {
            console.warn("[email] EMAIL_REPLY_TO is not configured; skipping email.");
        }
        return;
    }

    const items = order.orderItems
        .map((item) => (
            `<li>${item.quantity}x ${escapeHtml(item.product?.name ?? "Onbekend product")} - ` +
            `€${Number(item.unitPrice).toFixed(2)}</li>`
        ))
        .join("");
    const location = escapeHtml(order.location?.name ?? "Onbekende locatie");
    const pickupTime = escapeHtml(
        new Intl.DateTimeFormat("nl-NL", {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "Europe/Amsterdam",
        }).format(order.pickupTime),
    );

    const { error } = await resend.emails.send({
        from, replyTo,
        to: [recipient],
        subject: `Bevestiging bestelling #${order.id}`,
        html: `
            <h1>Je bestelling is ontvangen</h1>
            <p>Bestelling <strong>#${order.id}</strong> staat klaar als betaling is afgerond.</p>
            <p><strong>Ophalen:</strong> ${pickupTime}<br>
            <strong>Locatie:</strong> ${location}</p>
            <h2>Bestelde producten</h2>
            <ul>${items}</ul>
            <p><strong>Totaal: €${Number(order.totalPrice).toFixed(2)}</strong></p>
        `,
    });

    if (error) {
        throw new Error(`Resend rejected order confirmation: ${error.message}`);
    }
}
