import Stars from "../../../components/ui/Stars";
import WishlistButton from "../../../components/ui/WishlistButton";
import AlertControl from "../../../components/ui/AlertControl";
import { formatPrice } from "../../../lib/formatPrice";
import { effectiveDiscount } from "../../../lib/discount";
import { marketplaceStyle } from "../../../lib/marketplace";

function ProductHeroPanel({ original, cheapest }) {
  const { _id, brand, title, rating, currentPrice, originalPrice, discountPercentage, currency } = original;
  const discount = effectiveDiscount(currentPrice, originalPrice, discountPercentage);

  const cheapestStyle = cheapest ? marketplaceStyle(cheapest.marketplace) : null;

  return (
    <div className="card-surface rounded-3xl p-5 sm:p-6">
      {cheapest && (
        <div className="inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          <span className="w-4 h-4 rounded-full bg-white/25 grid place-items-center text-[10px]">
            {cheapestStyle.initial}
          </span>
          Best price on {cheapestStyle.label}
        </div>
      )}

      {brand && <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mb-1">{brand}</p>}
      <h1 className="text-2xl font-extrabold text-slate-900 leading-snug mb-2">{title}</h1>

      {rating && rating.average != null && (
        <div className="flex items-center gap-2 mb-4">
          <Stars rating={rating.average} />
          <span className="text-sm font-semibold text-slate-700">{rating.average.toFixed(2)}</span>
          {rating.reviews != null && <span className="text-sm text-slate-400">({rating.reviews} reviews)</span>}
        </div>
      )}

      {cheapest && cheapest.currentPrice != null ? (
        <>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(cheapest.currentPrice, cheapest.currency)}
            </span>
            {currentPrice != null && currentPrice !== cheapest.currentPrice && (
              <span className="text-base text-slate-400 line-through">{formatPrice(currentPrice, currency)}</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-5">Lowest price found across marketplaces</p>
        </>
      ) : (
        currentPrice != null && (
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-extrabold text-slate-900">{formatPrice(currentPrice, currency)}</span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-base text-slate-400 line-through">{formatPrice(originalPrice, currency)}</span>
            )}
          </div>
        )
      )}

      {discount != null && (
        <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mb-5">
          <span>↑</span> {discount}% OFF the listed price
        </p>
      )}

      {cheapest && cheapest.rawUrl && (
        <a
          href={cheapest.rawUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary block text-center h-auto py-3.5"
        >
          Buy on {cheapestStyle.label}
        </a>
      )}

      {_id && <WishlistButton productId={_id} variant="full" />}
      {/* Alert is created against the ORIGINAL listing's product id (matches
          WishlistButton above), so the price hint here must be the original's
          own currentPrice too - the backend validates targetPrice against
          THAT product's price, not the cross-marketplace "cheapest" one. */}
      {_id && <AlertControl productId={_id} currentPrice={currentPrice} currency={currency} />}
    </div>
  );
}

export default ProductHeroPanel;
