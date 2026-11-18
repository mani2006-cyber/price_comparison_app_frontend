import { authRequest } from "../auth/api";

export class LoginError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

async function loginRequest(path, body) {
    try {
        return await authRequest(path, { body });
    } catch (err) {
        if (err.status === 401) {
            throw new LoginError(err.message || "Invalid email or password", 401);
        }
        if (err.status === 429) {
            throw new LoginError("Too many login attempts. Please wait a bit and try again.", 429);
        }
        throw new LoginError(err.message || "Login failed. Please try again.", err.status);
    }
}

export function login({ email, password, captchaToken }) {
    return loginRequest("/login", {
        email,
        password,
        ...(captchaToken ? { captchaToken } : {}),
    });
}

export function completeMfaLogin({ challengeToken, otp }) {
    return loginRequest("/login/mfa", { challengeToken, otp });
}