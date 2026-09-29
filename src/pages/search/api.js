import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// sortBy must be one of the backend's SORT_BY_VALUES ('price_asc' |
// 'price_desc' | 'rating'); omitting it leaves results in the order the
// adapters returned them, which is their own relevance ordering.
//
// The backend returns the complete merged result set. Filters and pagination
// are handled by the frontend after this request completes.
export async function searchProducts(query, accessToken, { sortBy } = {}) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

    const params = new URLSearchParams({ q: query });
    if (sortBy) params.set("sortBy", sortBy);
    const res = await fetch(`${API_BASE}/api/search?${params.toString()}`, { headers });
    // { query, resultCount, products, marketplaceFailures }
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
