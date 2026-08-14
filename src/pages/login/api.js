import { API_BASE } from "../../lib/apiBase";

export class LoginError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export async function login({ email, password }) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required so Set-Cookie: refreshToken is stored by the browser
        body: JSON.stringify({ email, password }),
    });

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
            throw new LoginError(dataError || "Invalid email or password", 401);
        }
        if (res.status === 429) {
            throw new LoginError("Too many login attempts. Please wait a bit and try again.", 429);
        }
        throw new LoginError(dataError || `Login failed (HTTP ${res.status})`, res.status);
    }

    return data; // { success, user, accessToken }
}