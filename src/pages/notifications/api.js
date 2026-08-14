import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function getNotifications(accessToken) {
    const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res);
    return { notifications: data.notifications || [], unreadCount: data.unreadCount ?? 0 };
}

export async function markNotificationRead(accessToken, id) {
    const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res, "Notification not found");
    return data.notification;
}

export async function markAllNotificationsRead(accessToken) {
    const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res);
    return data.modifiedCount ?? 0;
}

// EventSource can't set an Authorization header, so the access token
// travels as a `?token=` query param on this one endpoint (server-side
// counterpart: requireAuthForStream in auth.middleware.js).
export function notificationStreamUrl(accessToken) {
    return `${API_BASE}/api/notifications/stream?token=${encodeURIComponent(accessToken)}`;
}
