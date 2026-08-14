export function validateName(name) {
    if (!name.trim()) return "Name is required";
    return null;
}

export function validateEmail(email) {
    if (!email.trim()) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Enter a valid email address";
    return null;
}

export function validatePassword(password) {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
}