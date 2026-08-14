import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function getProduct(id) {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`);
    const data = await parseResponse(res, "Product not found");
    return data.product;
}
