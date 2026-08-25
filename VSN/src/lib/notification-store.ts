// VSN — Global notification store (observable singleton)
// The bottom-right notification hub reads from this. Any part of the app can
// push a notification. System + security + connection-request items are shown.
// Clicking a notification routes to the relevant page.
"use client";

export type NotificationKind = "system" | "security" | "request";

export interface VsnNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  /** Where to route when clicked (e.g. "/receptor"). */
  route?: string;
  action?: { type: "accept" | "reject"; sessionId: string; donorId?: string };
  read: boolean;
}

type Listener = (items: VsnNotification[]) => void;

const listeners = new Set<Listener>();
let items: VsnNotification[] = [
  {
    id: "init",
    kind: "system",
    title: "VSN Kernel initialized",
    body: "Secure tunnel engine ready.",
    time: new Date().toLocaleTimeString(),
    route: "/connection",
    read: false,
  },
];

export function getNotifications(): VsnNotification[] {
  return items;
}

export function pushNotification(n: Omit<VsnNotification, "id" | "time" | "read">): void {
  items = [
    { ...n, id: Math.random().toString(36).slice(2), time: new Date().toLocaleTimeString(), read: false },
    ...items,
  ];
  emit();
}

export function markAllRead(): void {
  items = items.map((i) => ({ ...i, read: true }));
  emit();
}

export function markRead(id: string): void {
  items = items.map((i) => (i.id === id ? { ...i, read: true } : i));
  emit();
}

export function removeNotification(id: string): void {
  items = items.filter((i) => i.id !== id);
  emit();
}

export function subscribeNotifications(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(): void {
  for (const l of listeners) l(items);
}
