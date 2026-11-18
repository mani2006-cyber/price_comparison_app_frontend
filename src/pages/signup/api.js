import { authRequest } from "../auth/api";

export class SignupError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

export async function signup({ name, email, password, captchaToken }) {
    try {
        return await authRequest("/signup", {
            body: {
                name,
                email,
                password,
                ...(captchaToken ? { captchaToken } : {}),
            },
        });
    } catch (err) {
        if (err.status === 409) {
            throw new SignupError(err.message || "Email is already registered", 409);
        }
        if (err.status === 429) {
            throw new SignupError("Too many signup attempts. Please wait a bit and try again.", 429);
        }
        throw new SignupError(err.message || "Signup failed. Please try again.", err.status);
    }
}