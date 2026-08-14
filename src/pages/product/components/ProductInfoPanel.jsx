import Stars from "../../../components/ui/Stars";
import MarketplaceBadge from "../../../components/ui/MarketplaceBadge";
import WishlistButton from "../../../components/ui/WishlistButton";
import AlertControl from "../../../components/ui/AlertControl";
import { formatPrice } from "../../../lib/formatPrice";
import { effectiveDiscount } from "../../../lib/discount";
import { decodeHtml } from "../../../lib/decodeHtml";
import { marketplaceStyle } from "../../../lib/marketplace";
import { TruckIcon } from "../../../components/icons";

function ProductInfoPanel({ product }) {
  const {
    _id,
    marketplace,
    title,
    brand,
    currentPrice,
    originalPrice,
    discountPercentage,
    currency,
    rating,
    inStock,
    delivery,
    seller,
    rawUrl,
  } = product;

  const discount = effectiveDiscount(currentPrice, originalPrice, discountPercentage);
  const store = marketplaceStyle(marketplace).label;

  return (
    <div className="card-surface rounded-3xl p-5 sm:p-6">
      <MarketplaceBadge marketplace={marketplace} className="mb-4 inline-block" />

      {brand && <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mb-1">{brand}</p>}
      <h1 className="text-2xl font-extrabold text-slate-900 leading-snug mb-2">{decodeHtml(title)}</h1>

      {rating && rating.average != null && (
        <div className="flex items-center gap-2 mb-4">
          <Stars rating={rating.average} />
          <span className="text-sm font-semibold text-slate-700">{rating.average.toFixed(2)}</span>
          {rating.reviews != null && <span className="text-sm text-slate-400">({rating.reviews} reviews)</span>}
        </div>
      )}

      {currentPrice != null ? (
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-extrabold text-slate-900">{formatPrice(currentPrice, currency)}</span>
          {originalPrice && originalPrice > currentPrice && (
            <span className="text-base text-slate-400 line-through">{formatPrice(originalPrice, currency)}</span>
          )}
        </div>
      ) : (
        <p className="text-base font-semibold text-slate-400 mb-1">Price unavailable</p>
      )}

      {discount != null && (
        <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mb-5">
          <span>↑</span> {discount}% OFF the listed price
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-5">
        {inStock === true && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-1 rounded-full">
            In stock
          </span>
        )}
        {inStock === false && (
          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 ring-1 ring-rose-200 px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
        {seller && seller.name && (
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
            Sold by {seller.name}
          </span>
        )}
      </div>

      {delivery && delivery.estimate && (
        <p className="text-xs text-slate-500 mb-5 flex items-center gap-1.5">
          <TruckIcon className="w-3.5 h-3.5 shrink-0" /> {delivery.estimate}
        </p>
      )}

      {rawUrl && (
        <a href={rawUrl} target="_blank" rel="noreferrer" className="btn-primary block text-center h-auto py-3.5">
          View on {store}
        </a>
      )}

      {_id && <WishlistButton productId={_id} variant="full" />}
      {_id && <AlertControl productId={_id} currentPrice={currentPrice} currency={currency} />}
    </div>
  );
}

export default ProductInfoPanel;
