// Reads the `exp` claim out of a JWT client-side, WITHOUT verifying its
// signature - this is only ever used to schedule a proactive token refresh
// ahead of time, never to make an actual auth/authorization decision (the
// backend is the sole source of truth for whether a token is valid).
export function decodeJwtExpMs(token) {
    try {
        const payload = token.split(".")[1];
        // JWTs use base64url, not plain base64 - swap the two characters that
        // differ and restore the padding atob() expects.
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
        const json = JSON.parse(atob(base64));
        return typeof json.exp === "number" ? json.exp * 1000 : null;
    } catch {
        return null;
    }
}
