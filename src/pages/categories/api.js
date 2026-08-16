import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// Public (no auth) - browsing the catalog is the same "look, don't touch"
// concern as GET /products/:id.
//
// There's deliberately no getCategories() wrapper for GET /api/categories:
// the browse grid is a fixed editorial list (see categoryCatalog.jsx), and
// this per-category endpoint is reached only by the category links on a
// product card / product detail, where the name comes from the product
// itself rather than from that endpoint's list.

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
