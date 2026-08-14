import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function compareUrl(url) {
    const res = await fetch(`${API_BASE}/api/compare-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    });
    const data = await parseResponse(res);
    return data.result;
}
