import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function searchProducts(query, accessToken) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`, { headers });
    return parseResponse(res);
}

export async function getSearchHistory(accessToken) {
    const res = await fetch(`${API_BASE}/api/search/history`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res);
    return data.history || [];
}

export async function deleteSearchHistoryItem(accessToken, id) {
    const res = await fetch(`${API_BASE}/api/search/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return parseResponse(res, "Search history item not found");
}
