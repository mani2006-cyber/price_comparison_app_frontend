import { Link } from "react-router-dom";
import Stars from "./Stars";
import MarketplaceBadge from "./MarketplaceBadge";
import WishlistButton from "./WishlistButton";
import { BoxIcon } from "../icons";
import { formatPrice } from "../../lib/formatPrice";
import { categoryPath } from "../../lib/categoryPath";

/**
 * `hideCategoryLink` is for the category browse page itself, where every card
 * already shares the same category - linking each one back to the page you're
 * standing on is just noise.
 */
function ProductCard({ product, style, hideCategoryLink = false }) {
  const {
    _id,
    marketplace,
    title,
    brand,
    images,
    currentPrice,
    originalPrice,
    discountPercentage,
    currency,
    rating,
    inStock,
    availability,
    delivery,
    category,
    attributes,
    rawUrl,
  } = product;

  const img = images && images.length ? images[0] : null;
  // Clicking a product auto-runs the price comparison for its source link.
  const comparePath = rawUrl ? `/compare-url?url=${encodeURIComponent(rawUrl)}` : null;

  // Some marketplaces (e.g. Flipkart) omit discountPercentage even though
  // both prices are present — derive it so the badge/strikethrough still show.
  const effectiveDiscount =
    discountPercentage && discountPercentage > 1
      ? discountPercentage
      : originalPrice && currentPrice && originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : null;
  const hasDiscount = effectiveDiscount && effectiveDiscount > 1;

  const attrEntries = attributes ? Object.entries(attributes).filter(([, v]) => v) : [];

  return (
    <div
      style={style}
      className="animate-in card-surface rounded-3xl p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative rounded-2xl bg-slate-50 aspect-square mb-3 overflow-hidden">
        <Link to={comparePath || "#"} className="grid place-items-center w-full h-full">
          {img ? (
            <img src={img} alt={title} className="max-h-full max-w-full object-contain p-2" loading="lazy" />
          ) : (
            <BoxIcon className="w-10 h-10 text-slate-300" />
          )}
        </Link>

        <MarketplaceBadge marketplace={marketplace} className="absolute top-2 left-2" />

        {_id && <WishlistButton productId={_id} className="absolute top-2 right-2" />}

        {inStock === false && (
          <span className="absolute bottom-2 right-2 bg-slate-800/85 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Out of stock
          </span>
        )}
        {hasDiscount && (
          <span className="absolute bottom-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {Math.round(effectiveDiscount)}% off
          </span>
        )}
      </div>

      {category && !hideCategoryLink ? (
        <Link
          to={categoryPath(category)}
          className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 truncate mb-1 block hover:underline"
        >
          {category}
        </Link>
      ) : (
        <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 truncate mb-1">
          {category || brand || "Product"}
        </p>
      )}

      <Link to={comparePath || "#"}>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] hover:text-violet-600 transition-colors">
          {title}
        </h3>
      </Link>

      <div className="flex items-center gap-1.5 mb-2">
        {rating && rating.average ? (
          <>
            <Stars rating={rating.average} />
            <span className="text-xs text-slate-500">
              {rating.average.toFixed(1)}
              {rating.reviews ? ` (${rating.reviews.toLocaleString("en-IN")})` : ""}
            </span>
          </>
        ) : (
          <span className="text-xs text-slate-300">No ratings yet</span>
        )}
      </div>

      {attrEntries.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {attrEntries.slice(0, 2).map(([k, v]) => (
            <span key={k} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 rounded-full px-2 py-0.5">
              {k}: {v}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-baseline gap-2 mb-1">
        {currentPrice != null ? (
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(currentPrice, currency)}</span>
        ) : (
          <span className="text-sm font-semibold text-slate-400">Price unavailable</span>
        )}
        {hasDiscount && originalPrice ? (
          <span className="text-xs text-slate-400 line-through">{formatPrice(originalPrice, currency)}</span>
        ) : null}
      </div>

      <div className="text-[11px] text-slate-400 mb-3">
        {delivery && delivery.free
          ? "Free delivery"
          : delivery && delivery.estimate
          ? delivery.estimate
          : availability === "unknown"
          ? "Delivery info unavailable"
          : ""}
      </div>

      {comparePath && (
        <Link to={comparePath} className="btn-primary mt-auto h-9 text-sm">
          Compare prices
        </Link>
      )}
    </div>
  );
}

export default ProductCard;
