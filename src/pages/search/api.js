import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// sortBy must be one of the backend's SORT_BY_VALUES ('price_asc' |
// 'price_desc' | 'rating'); omitting it leaves results in the order the
// adapters returned them, which is their own relevance ordering.
//
// Sorting is applied server-side across the WHOLE result set before it's
// paginated, so it can't be done in the client instead - that would only
// reorder the current page.
export async function searchProducts(query, accessToken, {
    sortBy,
    page,
    limit,
    category,
    brand,
    marketplace,
    minPrice,
    maxPrice,
} = {}) {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

    const params = new URLSearchParams({ q: query });
    if (sortBy) params.set("sortBy", sortBy);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    // The API treats category as a case-insensitive contains match against
    // both category and categoryPath, which keeps marketplace taxonomies
    // compatible (for example, "Mobiles" and "Mobiles & Accessories").
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (marketplace) params.set("marketplace", marketplace);
    if (minPrice !== undefined && minPrice !== "") params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined && maxPrice !== "") params.set("maxPrice", String(maxPrice));

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
