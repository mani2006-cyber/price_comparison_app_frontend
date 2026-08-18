import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";
import { getAdminKey } from "../../lib/adminKey";

// The write side of the curated catalog: /api/admin/products/*. Every
// route here is gated on the shared `x-admin-key` secret rather than the
// user JWT — see lib/adminKey.js for why that key is typed in at runtime
// instead of being baked into the build.

function adminHeaders(extra) {
    return { "x-admin-key": getAdminKey(), ...extra };
}

// skipUnauthorizedHandler keeps a bad admin key from tearing down the
// signed-in shopper's session — see lib/http.js for the full reasoning.
const ADMIN_PARSE_OPTS = { skipUnauthorizedHandler: true };

export async function listAdminProducts({ category, page, limit } = {}) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const qs = params.toString();
    const res = await fetch(`${API_BASE}/api/admin/products${qs ? `?${qs}` : ""}`, {
        headers: adminHeaders(),
    });
    const data = await parseResponse(res, undefined, ADMIN_PARSE_OPTS);
    // { page, limit, total, totalPages, products } — includes hidden entries
    return data.result;
}

export async function createAdminProduct(body) {
    const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
    });
    const data = await parseResponse(res, undefined, ADMIN_PARSE_OPTS);
    return data.product;
}

export async function updateAdminProduct(id, body) {
    const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "PATCH",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
    });
    const data = await parseResponse(res, "Catalog product not found", ADMIN_PARSE_OPTS);
    return data.product;
}

export async function deleteAdminProduct(id) {
    const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
    });
    await parseResponse(res, "Catalog product not found", ADMIN_PARSE_OPTS);
}

// There's no dedicated "is this key valid?" endpoint, so the gate probes
// the cheapest admin route there is (one product, one page) and treats a
// clean response as proof. A 401 means the key is wrong; a 500 means the
// server has no ADMIN_API_KEY configured at all (the middleware fails
// closed) — two different problems, and the gate says which is which.
export async function verifyAdminKey() {
    return listAdminProducts({ limit: 1 });
}
