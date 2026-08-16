import { marketplaceStyle } from "../../../lib/marketplace";

function DetailsTable({ product, className = "" }) {
  const { marketplace, brand, category, sku, attributes } = product;

  const entries = [];
  entries.push(["Marketplace", marketplaceStyle(marketplace).label]);
  if (brand) entries.push(["Brand", brand]);
  if (category) entries.push(["Category", category]);
  if (sku) entries.push(["SKU", sku]);
  if (attributes) {
    Object.entries(attributes).forEach(([k, v]) => {
      if (v) entries.push([k, v]);
    });
  }

  return (
    <div className={`card-surface rounded-3xl overflow-hidden ${className}`}>
      <h2 className="text-base font-extrabold text-slate-900 px-5 pt-5 pb-3">Details</h2>
      <dl>
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`flex items-center justify-between px-5 py-3 text-sm ${
              i !== entries.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <dt className="text-slate-400">{key}</dt>
            <dd className="font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default DetailsTable;
