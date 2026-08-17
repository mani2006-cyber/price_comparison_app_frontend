import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

// page/limit paginate result.similarProducts ONLY - result.results (the
// strict cross-marketplace price comparison) is always returned whole.
//
// limit is deliberately not sent: the backend's own default page size
// (SIMILAR_PRODUCTS_DEFAULT_LIMIT, 6) is the right size for a suggestion
// strip, and leaving it there keeps one source of truth rather than a
// frontend constant that can drift out of step with the server's cap.
export async function compareUrl(url, { page } = {}) {
    const qs = page && page > 1 ? `?page=${encodeURIComponent(page)}` : "";
    const res = await fetch(`${API_BASE}/api/compare-url${qs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    });
    const data = await parseResponse(res);
    // { originalUrl, detectedMarketplace, matchesFound, results,
    //   similarProducts, similarProductsPage, similarProductsLimit,
    //   similarProductsTotal, similarProductsTotalPages,
    //   marketplaceFailures, aiSummary }
    return data.result;
}
