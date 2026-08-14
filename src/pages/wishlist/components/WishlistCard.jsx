import { Link } from "react-router-dom";
import Stars from "../../../components/ui/Stars";
import MarketplaceBadge from "../../../components/ui/MarketplaceBadge";
import { formatPrice } from "../../../lib/formatPrice";
import { decodeHtml } from "../../../lib/decodeHtml";
import { BoxIcon } from "../../../components/icons";

function WishlistCard({ entry, onRemove, removing }) {
  const product = entry.productId || {};
  const itemId = entry._id;
  const img = product.images && product.images.length ? product.images[0] : null;
  const productPath = product._id ? `/products/${product._id}` : null;

  // The backend keeps only the running lowest/highest ever observed for a
  // product (Product.lowestPrice/highestPrice) - there's no per-observation
  // history log/endpoint, so that's the most granular price context available.
  const showLowest = product.lowestPrice != null && product.currentPrice != null && product.lowestPrice < product.currentPrice;
  const showHighest = product.highestPrice != null && product.currentPrice != null && product.highestPrice > product.currentPrice;

  return (
    <div className="card-surface rounded-3xl p-4">
      <div className="flex gap-4">
        <Link
          to={productPath || "#"}
          className="w-24 h-24 rounded-2xl bg-slate-50 shrink-0 grid place-items-center overflow-hidden"
        >
          {img ? (
            <img src={img} alt={product.title} className="max-h-full max-w-full object-contain p-1.5" loading="lazy" />
          ) : (
            <BoxIcon className="w-8 h-8 text-slate-300" />
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <MarketplaceBadge marketplace={product.marketplace} className="mb-1.5 inline-block" />

          <Link to={productPath || "#"}>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-violet-600 transition-colors">
              {decodeHtml(product.title) || "Untitled product"}
            </h3>
          </Link>

          {product.rating && product.rating.average != null && (
            <div className="flex items-center gap-1.5 mt-1">
              <Stars rating={product.rating.average} />
              <span className="text-xs text-slate-500">{product.rating.average.toFixed(1)}</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mt-1.5">
            {product.currentPrice != null ? (
              <span className="text-base font-extrabold text-slate-900">
                {formatPrice(product.currentPrice, product.currency)}
              </span>
            ) : (
              <span className="text-sm font-semibold text-slate-400">Price unavailable</span>
            )}
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {(showLowest || showHighest) && (
            <p className="text-[11px] text-slate-400 mt-1">
              {showLowest && <>Lowest ever {formatPrice(product.lowestPrice, product.currency)}</>}
              {showLowest && showHighest && " · "}
              {showHighest && <>Highest ever {formatPrice(product.highestPrice, product.currency)}</>}
            </p>
          )}

          {entry.notes && (
            <p className="text-xs text-slate-500 mt-1.5 italic">"{entry.notes}"</p>
          )}
        </div>

        <button
          onClick={() => onRemove(itemId)}
          disabled={removing}
          title="Remove from wishlist"
          className="shrink-0 h-8 w-8 grid place-items-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors cursor-pointer"
        >
          {removing ? (
            <span className="text-xs">…</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;
