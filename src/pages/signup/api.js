import { API_BASE } from "../../lib/apiBase";

export class SignupError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export async function signup({ name, email, password }) {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required so Set-Cookie: refreshToken is stored by the browser
        body: JSON.stringify({ name, email, password }),
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
        if (res.status === 409) {
            throw new SignupError(dataError || "Email is already registered", 409);
        }
        if (res.status === 429) {
            throw new SignupError("Too many signup attempts. Please wait a bit and try again.", 429);
        }
        throw new SignupError(dataError || `Signup failed (HTTP ${res.status})`, res.status);
    }

    return data; // { success, user, accessToken }
}