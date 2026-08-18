// Shared fetch-response handling for every page's api.js. Reads the JSON
// body FIRST and checks `success`/`error` before deciding what to throw -
// this backend always ships a specific, useful message on non-2xx
// responses (e.g. "A search query 'q' is required", "URL not recognized.
// Supported marketplaces: ..."), so bailing out early on `!res.ok` with a
// bare "HTTP 400" (as several pages used to) throws that message away.
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Fired on every 401 this helper sees, from any page's api.js. Registered
// once by AuthContext (the only thing that can actually act on it - clear
// the dead session so ProtectedRoute redirects to /login). Without this, a
// 401 was only ever visible to whichever component happened to catch it -
// most of them (WishlistContext, AlertContext, NotificationContext) just
// swallow fetch errors non-fatally and never told AuthContext the session
// had died, so the app kept rendering the protected page - just silently
// stuck on stale/empty data - instead of bouncing to a public view.
let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
    onUnauthorized = fn;
}

// `skipUnauthorizedHandler` opts a call out of the global 401 handler above.
// Only the admin catalog routes need it: they authenticate with a shared
// `x-admin-key` secret, an entirely separate scheme from the user JWT. A
// rejected admin key means "that key is wrong", NOT "this user's session
// died" - letting it reach the handler would log the signed-in shopper out
// of the app because someone mistyped an admin secret in another tab.
export async function parseResponse(res, notFoundMessage, { skipUnauthorizedHandler = false } = {}) {
    let data = null;
    try {
        data = await res.json();
    } catch {
        // no JSON body
    }

    const dataError = data && data.error ? data.error : null;
    const dataSuccess = data && data.success;

    if (!res.ok || dataSuccess === false) {
        if (res.status === 401) {
            if (onUnauthorized && !skipUnauthorizedHandler) onUnauthorized();
            throw new ApiError(dataError || "Please log in to continue", 401);
        }
        if (res.status === 404) {
            throw new ApiError(dataError || notFoundMessage || "Not found", 404);
        }
        if (res.status === 429) {
            throw new ApiError("Too many requests. Please wait a bit and try again.", 429);
        }
        throw new ApiError(dataError || `Request failed (HTTP ${res.status})`, res.status);
    }

    return data;
}
