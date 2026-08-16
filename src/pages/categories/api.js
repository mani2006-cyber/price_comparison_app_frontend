import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// Both endpoints are public (no auth) - browsing the catalog is the same
// "look, don't touch" concern as GET /products/:id.

export async function getCategories() {
    const res = await fetch(`${API_BASE}/api/categories`);
    const data = await parseResponse(res);
    return data.categories || []; // [{ category, count }] - alphabetical
}

// sortBy must be one of the backend's SORT_BY_VALUES ('price_asc' |
// 'price_desc' | 'rating') - anything else is rejected with a 400 by the
// route's Zod schema, so the UI only ever offers those three plus "default"
// (omit the param entirely = most recently checked first).
export async function getCategoryProducts(category, { sortBy, page, limit } = {}) {
    const params = new URLSearchParams();
    if (sortBy) params.set("sortBy", sortBy);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    const res = await fetch(
        `${API_BASE}/api/categories/${encodeURIComponent(category)}/products${qs ? `?${qs}` : ""}`
    );
    const data = await parseResponse(res, "Category not found");
    // { category, page, limit, total, totalPages, products }
    return data.result;
}
