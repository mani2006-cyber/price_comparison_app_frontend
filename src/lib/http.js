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

export async function parseResponse(res, notFoundMessage) {
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
