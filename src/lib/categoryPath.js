// Category names are free text off the marketplaces - they contain spaces
// ("Laptop Bag"), ampersands, and occasionally slashes ("Electronics/Mobiles").
// A raw slash would split into an extra path segment and miss the route, so
// every link has to go through encodeURIComponent. Centralised here so a
// caller can't build the path by hand and quietly break on one category.
export function categoryPath(category) {
    return `/categories/${encodeURIComponent(String(category ?? "").trim())}`;
}
