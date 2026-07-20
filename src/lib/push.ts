import webpush from "web-push";
import prisma from "@/lib/prisma";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
  );
}

function configureWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:orders@madni-fast-food.local",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Being prepared",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function orderStatusMessage(orderNumber: string, status: string, orderId?: string): PushPayload {
  const label = STATUS_LABELS[status] || status.replace(/_/g, " ");
  return {
    title: `Order ${orderNumber}`,
    body: `Status: ${label}`,
    url: orderId ? `/orders/${orderId}` : "/dashboard",
  };
}

export function newOrderAdminMessage(orderNumber: string, customerName: string, total: number): PushPayload {
  return {
    title: "New order received",
    body: `${orderNumber} — ${customerName} · Rs ${Math.round(total)}`,
    url: "/admin/orders",
  };
}

export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  if (!isPushConfigured()) return;

  configureWebPush();

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const data = JSON.stringify(payload);

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          data
        );
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
      }
    })
  );
}

export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  await Promise.all(admins.map((a) => sendPushToUser(a.id, payload)));
}
