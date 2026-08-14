import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function getWishlist(accessToken) {
    const res = await fetch(`${API_BASE}/api/wishlist`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseResponse(res);
    return data.items || []; // [{ _id, userId, productId: {...full product}, notes, createdAt, updatedAt }]
}

export async function addToWishlist(accessToken, { productId, notes }) {
    const res = await fetch(`${API_BASE}/api/wishlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId, notes }),
    });
    const data = await parseResponse(res);
    return data.item;
}

export async function removeFromWishlist(accessToken, itemId) {
    const res = await fetch(`${API_BASE}/api/wishlist/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return parseResponse(res, "Wishlist item not found");
}
