export function effectiveDiscount(currentPrice, originalPrice, discountPercentage) {
    if (discountPercentage && discountPercentage > 1) return discountPercentage;
    if (originalPrice && currentPrice && originalPrice > currentPrice) {
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return null;
}
