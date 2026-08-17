// Every environment-dependent value the app reads, resolved in one place.
//
// Vite only exposes variables prefixed VITE_, and substitutes them at BUILD
// time - they are not read at runtime and are not secret (everything here
// ends up in the shipped bundle). So this file is for "what does this build
// point at / behave like", never for credentials.
//
// Each value has a working default, so `npm run dev` needs no .env at all.
// See .env.example for the full list.

function num(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const API_PORT = num(import.meta.env.VITE_API_PORT, 4995);

// Deriving the host from window.location (rather than hardcoding localhost)
// is what lets the app be opened from a phone on the same wifi: the browser
// asks whatever machine served the page, instead of asking the phone itself.
// VITE_API_BASE_URL overrides that outright, which is what a real deployment
// needs - there the API is on its own host/scheme, not the same box on a
// dev port.
function resolveApiBase() {
    const explicit = (import.meta.env.VITE_API_BASE_URL || "").trim();
    if (explicit) return explicit.replace(/\/+$/, ""); // tolerate a trailing slash
    return `${window.location.protocol}//${window.location.hostname}:${API_PORT}`;
}

export const config = {
    apiBaseUrl: resolveApiBase(),

    // The search run when /search is opened with no ?q= of its own.
    defaultSearchQuery: (import.meta.env.VITE_DEFAULT_SEARCH_QUERY || "laptop").trim(),

    // Products per page. Both endpoints cap `limit` in their Zod schema
    // (SEARCH_MAX_LIMIT / CATEGORY_MAX_LIMIT, both 50 by default), so these
    // are clamped rather than passed through blindly - an over-large value
    // would otherwise turn every request into a 400 instead of just being
    // rounded down.
    searchPageSize: Math.min(num(import.meta.env.VITE_SEARCH_PAGE_SIZE, 20), 50),
    categoryPageSize: Math.min(num(import.meta.env.VITE_CATEGORY_PAGE_SIZE, 20), 50),
};
