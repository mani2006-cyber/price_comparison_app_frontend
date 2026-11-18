import { parseResponse } from "../../lib/http";
import { API_BASE } from "../../lib/apiBase";

export async function authRequest(path, { body, accessToken } = {}) {
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const res = await fetch(`${API_BASE}/api/auth${path}`, {
        method: "POST",
        headers,
        credentials: "include",
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return parseResponse(res);
}

export function requestPasswordReset(email) {
    return authRequest("/password/forgot", { body: { email } });
}

export function resetPassword(email, otp, password) {
    return authRequest("/password/reset", { body: { email, otp, password } });
}

export function changePassword(accessToken, currentPassword, newPassword) {
    return authRequest("/password/change", {
        accessToken,
        body: { currentPassword, newPassword },
    });
}

export function requestEmailMfaChallenge(accessToken, password, action) {
    return authRequest("/mfa/email/challenge", {
        accessToken,
        body: { password, action },
    });
}

export function verifyEmailMfa(accessToken, challengeToken, otp) {
    return authRequest("/mfa/email/verify", {
        accessToken,
        body: { challengeToken, otp },
    });
}
