import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// Public (no auth) — browsing the catalog is the same "look, don't touch"
// concern as GET /products/:id. All three endpoints read the admin-curated
// catalog (AdminProduct), which is written through /admin — see
// pages/admin/api.js for that side.

/** GET /api/categories → [{ category, count }], alphabetical, active only. */
export async function getCategories() {
    const res = await fetch(`${API_BASE}/api/categories`);
    const data = await parseResponse(res);
    return data.categories;
}

/**
 * GET /api/categories/:category/products → the catalog cards in a category.
 *
 * These are AdminProduct entries — { _id, title, description, category,
 * price, image } — NOT marketplace listings. There's no marketplace, rating,
 * stock or product URL on them, which is why this page renders CatalogCard
 * rather than the ProductCard used for real listings.
 *
 * sortBy accepts the backend's SORT_BY_VALUES, but only price_asc/price_desc
 * do anything here: 'rating' is a valid enum value route-wide, and an
 * AdminProduct has no rating field, so the repository silently falls back to
 * newest-first. The UI therefore doesn't offer it — see CategoryProductsPage.
 */
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

/**
 * GET /api/categories/:category/products/:id → the click-through.
 *
 * A catalog entry has no listing behind it, so opening one triggers a real
 * live multi-marketplace search keyed by its title. That means this call is
 * genuinely slow on a cache miss (seconds, several marketplaces in parallel),
 * unlike the two above — the page shows a skeleton for it rather than a
 * spinner over the whole view.
 *
 * Returns { adminProduct, listings, comparison } — both keys always present,
 * exactly one non-null, depending on whether the admin gave the entry a url:
 *
 *   no url  → `listings`, the same shape as GET /search:
 *             { products, total, page, limit, totalPages, marketplaceFailures }
 *   url set → `comparison`, the same shape as POST /compare-url:
 *             { results, matchesFound, similarProducts, similarProductsPage…,
 *               marketplaceFailures, aiSummary }
 *
 * Branch on which is non-null, not on adminProduct.url — the response is the
 * authority on which pipeline actually ran.
 *
 * page/limit mean different things per branch: they paginate `listings` in
 * search mode, and `comparison.similarProducts` in comparison mode (compare-url
 * has never paginated results[]). sortBy applies to search mode only.
 */
export async function getCatalogProductListings(category, id, { sortBy, page, limit } = {}) {
    const params = new URLSearchParams();
    if (sortBy) params.set("sortBy", sortBy);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    const res = await fetch(
        `${API_BASE}/api/categories/${encodeURIComponent(category)}/products/${encodeURIComponent(id)}${
            qs ? `?${qs}` : ""
        }`
    );
    const data = await parseResponse(res, "Catalog product not found");
    return data.result;
}
