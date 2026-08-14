export function formatPrice(value, currency) {
    if (value === null || value === undefined) return null;
    try {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency || "INR",
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${currency || ""} ${value}`;
    }
}
