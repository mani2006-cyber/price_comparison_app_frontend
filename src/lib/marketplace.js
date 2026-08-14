// Single source of truth for per-marketplace styling: badge chips (search/product
// listings) and solid-fill avatars (compare/offer rows). Both views read the same
// registry so a store's color never drifts between pages. Hues are chosen to stay
// clear of the app's own violet/cyan brand accent, so a store badge never reads
// as an "active" or brand-colored control.
const MARKETPLACES = {
    amazon: {
        label: "Amazon",
        initial: "A",
        bg: "bg-orange-50",
        text: "text-orange-700",
        solid: "bg-orange-500",
    },
    flipkart: {
        label: "Flipkart",
        initial: "F",
        bg: "bg-blue-50",
        text: "text-blue-700",
        solid: "bg-blue-600",
    },
    myntra: {
        label: "Myntra",
        initial: "M",
        bg: "bg-pink-50",
        text: "text-pink-700",
        solid: "bg-pink-600",
    },
    lenskart: {
        label: "Lenskart",
        initial: "L",
        bg: "bg-teal-50",
        text: "text-teal-700",
        solid: "bg-teal-600",
    },
    nykaa: {
        label: "Nykaa",
        initial: "N",
        bg: "bg-rose-50",
        text: "text-rose-700",
        solid: "bg-rose-600",
    },
    poorvika: {
        label: "Poorvika",
        initial: "P",
        bg: "bg-amber-50",
        text: "text-amber-700",
        solid: "bg-amber-500",
    },
    vijaysales: {
        label: "Vijay Sales",
        initial: "V",
        bg: "bg-lime-50",
        text: "text-lime-700",
        solid: "bg-lime-600",
    },
};

const FALLBACK = (marketplace) => ({
    label: marketplace ? marketplace[0].toUpperCase() + marketplace.slice(1) : "Store",
    initial: marketplace ? marketplace[0].toUpperCase() : "?",
    bg: "bg-slate-100",
    text: "text-slate-600",
    solid: "bg-slate-400",
});

export function marketplaceStyle(marketplace) {
    return MARKETPLACES[marketplace] || FALLBACK(marketplace);
}
