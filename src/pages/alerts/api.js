import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function getAlerts(accessToken) {
    const res = await fetch(`${API_BASE}/api/alerts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res);
    return data.alerts || []; // [{ _id, productId: {...full product}, targetPrice, status, triggeredAt, triggeredAtPrice, ... }]
}

export async function createAlert(accessToken, { productId, targetPrice }) {
    const res = await fetch(`${API_BASE}/api/alerts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId, targetPrice }),
    });
    // Business-rule failures ("Target price must be lower than the current
    // price (₹X)") come back as a plain 400 with `error` set - parseResponse
    // already surfaces that via ApiError.message, no special-casing needed here.
    const data = await parseResponse(res);
    return data.alert; // productId NOT populated on create - caller refreshes for the full list.
}

export async function cancelAlert(accessToken, id) {
    const res = await fetch(`${API_BASE}/api/alerts/${id}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res, "Active alert not found");
    return data.alert;
}
