import { marketplaceStyle } from "../../lib/marketplace";

/** Small rounded chip used to tag a product/offer with its source store. */
function MarketplaceBadge({ marketplace, className = "" }) {
  const style = marketplaceStyle(marketplace);
  return (
    <span
      className={`${style.bg} ${style.text} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm ${className}`}
    >
      {style.label}
    </span>
  );
}

export default MarketplaceBadge;
