import { marketplaceStyle } from "../../lib/marketplace";

/** Solid-fill initial avatar used in compare/offer rows. */
function MarketplaceAvatar({ marketplace, className = "" }) {
  const style = marketplaceStyle(marketplace);
  return (
    <span
      className={`w-9 h-9 rounded-full ${style.solid} text-white text-sm font-bold grid place-items-center shrink-0 ${className}`}
    >
      {style.initial}
    </span>
  );
}

export default MarketplaceAvatar;
