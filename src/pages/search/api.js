import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// sortBy must be one of the backend's SORT_BY_VALUES ('price_asc' |
// 'price_desc' | 'rating'); omitting it leaves results in the order the
// adapters returned them, which is their own relevance ordering.
//
// Sorting is applied server-side across the WHOLE result set before it's
// paginated, so it can't be done in the client instead - that would only
// reorder the current page.
export async function searchProducts(query, accessToken, { sortBy, page, limit } = {}) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

    const params = new URLSearchParams({ q: query });
    if (sortBy) params.set("sortBy", sortBy);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const res = await fetch(`${API_BASE}/api/search?${params.toString()}`, { headers });
    // { query, resultCount (total across all pages), products (this page),
    //   page, limit, totalPages, marketplaceFailures }
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
