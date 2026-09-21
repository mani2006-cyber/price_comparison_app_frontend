function contains(value, query) {
  return String(value ?? "").toLowerCase().includes(String(query ?? "").trim().toLowerCase());
}

function matchesCategory(product, categoryQuery) {
  if (!categoryQuery) return true;

  const categoryPath = Array.isArray(product.categoryPath)
    ? product.categoryPath
    : product.categoryPath
      ? [product.categoryPath]
      : [];

  return [product.category, ...categoryPath].some((value) => contains(value, categoryQuery));
}

export function filterProducts(products, { category, brand, marketplace, minPrice, maxPrice } = {}) {
  const categoryQuery = String(category ?? "").trim();
  const brandQuery = String(brand ?? "").trim();
  const marketplaceQuery = String(marketplace ?? "").trim().toLowerCase();
  const minimum = minPrice === "" || minPrice == null ? null : Number(minPrice);
  const maximum = maxPrice === "" || maxPrice == null ? null : Number(maxPrice);

  return products.filter((product) => {
    const categoryMatches = matchesCategory(product, categoryQuery);
    const matchesBrand = !brandQuery || contains(product.brand, brandQuery);
    const matchesMarketplace = !marketplaceQuery || String(product.marketplace ?? "").toLowerCase() === marketplaceQuery;
    const price = Number(product.currentPrice);
    const matchesMinimum = minimum == null || (Number.isFinite(price) && price >= minimum);
    const matchesMaximum = maximum == null || (Number.isFinite(price) && price <= maximum);

    return categoryMatches && matchesBrand && matchesMarketplace && matchesMinimum && matchesMaximum;
  });
}