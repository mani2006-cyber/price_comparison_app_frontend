export function validateEmail(email) {
    if (!email.trim()) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Enter a valid email address";
    return null;
}

export function validatePassword(password) {
    if (!password) return "Password is required";
    return null;
}