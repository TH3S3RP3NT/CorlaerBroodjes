import type { orders } from "@/db/schema";

type OrderStatus = (typeof orders.$inferSelect)["status"];

const statusLabels: Record<OrderStatus, string> = {
    PENDING_PAYMENT: "Betaling nodig",
    PAID: "Betaald",
    IN_PREPARATION: "In bereiding",
    READY: "Klaar om op te halen",
    COMPLETED: "Afgerond",
    CANCELLED: "Geannuleerd",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
            {statusLabels[status]}
        </span>
    );
}
