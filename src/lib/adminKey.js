// Where the admin API key lives on the client, and — more importantly —
// where it deliberately does NOT live.
//
// The backend gates /api/admin/products/* on a single shared secret sent
// as the `x-admin-key` header (adminAuth.middleware.js). It is the same
// secret for everyone; there is no per-admin account, no expiry, and no
// revocation short of changing it in the server's .env and restarting.
//
// So it must NEVER become a VITE_ADMIN_KEY. Vite substitutes VITE_* vars
// into the bundle at BUILD time, which would ship the master admin
// credential inside the JavaScript every anonymous visitor downloads —
// readable with "view source", and granting full write access to the
// catalog. That isn't a hardening nicety; it's the whole security model
// of these routes.
//
// Instead the admin types the key into /admin and we hold it in
// sessionStorage: scoped to one tab, cleared when that tab closes, and
// never written to disk the way localStorage is. The cost is retyping it
// after closing the tab, which is the correct trade for a shared secret
// with no expiry.

const STORAGE_KEY = "searchhub.adminKey";

export function getAdminKey() {
    try {
        return sessionStorage.getItem(STORAGE_KEY) || "";
    } catch {
        // Private-mode Safari and similar can throw on storage access.
        return "";
    }
}

export function setAdminKey(key) {
    try {
        sessionStorage.setItem(STORAGE_KEY, key);
    } catch {
        /* non-fatal: the key just won't survive a reload */
    }
}

export function clearAdminKey() {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        /* nothing to clear */
    }
}

// Only ever shown back to the person who just typed it, so they can
// confirm the right key is loaded without it being readable over a
// shoulder or in a screen share.
export function maskAdminKey(key) {
    if (!key) return "";
    if (key.length <= 8) return "•".repeat(key.length);
    return `${key.slice(0, 4)}${"•".repeat(12)}${key.slice(-4)}`;
}
