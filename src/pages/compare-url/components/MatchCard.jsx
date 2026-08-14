import Stars from "../../../components/ui/Stars";
import MarketplaceBadge from "../../../components/ui/MarketplaceBadge";
import SimilarityMeter from "./SimilarityMeter";
import { formatPrice } from "../../../lib/formatPrice";
import { decodeHtml } from "../../../lib/decodeHtml";
import { BoxIcon } from "../../../components/icons";

function MatchCard({ product, originalPrice }) {
  const { marketplace, title, brand, images, currentPrice, currency, rating, inStock, availability, rawUrl, similarityScore } =
    product;

  const img = images && images.length ? images[0] : null;

  let priceDelta = null;
  if (currentPrice != null && originalPrice != null && originalPrice > 0) {
    const diffPct = Math.round(((currentPrice - originalPrice) / originalPrice) * 100);
    if (Math.abs(diffPct) >= 1) priceDelta = diffPct;
  }

  return (
    <div className="animate-in card-surface rounded-3xl p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <a
        href={rawUrl}
        target="_blank"
        rel="noreferrer"
        className="relative rounded-2xl bg-slate-50 aspect-square mb-3 grid place-items-center overflow-hidden"
      >
        {img ? (
          <img src={img} alt={title} className="max-h-full max-w-full object-contain p-3" loading="lazy" />
        ) : (
          <BoxIcon className="w-10 h-10 text-slate-300" />
        )}
        <MarketplaceBadge marketplace={marketplace} className="absolute top-2 left-2" />
        {inStock === false && (
          <span className="absolute top-2 right-2 bg-slate-800/85 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Out of stock
          </span>
        )}
      </a>

      <div className="mb-2">
        <SimilarityMeter score={similarityScore} />
      </div>

      {brand && <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-600 truncate mb-1">{brand}</p>}

      <a href={rawUrl} target="_blank" rel="noreferrer">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem] hover:text-violet-600 transition-colors">
          {decodeHtml(title)}
        </h3>
      </a>

      <div className="flex items-center gap-1.5 mb-2">
        {rating?.average ? (
          <>
            <Stars rating={rating.average} />
            <span className="text-xs text-slate-500">{rating.average.toFixed(1)}</span>
          </>
        ) : (
          <span className="text-xs text-slate-300">No ratings yet</span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        {currentPrice != null ? (
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(currentPrice, currency)}</span>
        ) : (
          <span className="text-sm font-semibold text-slate-400">Price unavailable</span>
        )}
      </div>

      <div className="mb-3 h-4">
        {priceDelta !== null && (
          <span
            className={`text-[11px] font-bold ${
              priceDelta < 0 ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {priceDelta < 0 ? `${Math.abs(priceDelta)}% cheaper` : `${priceDelta}% costlier`} than original
          </span>
        )}
        {priceDelta === null && availability === "unknown" && (
          <span className="text-[11px] text-slate-300">Availability unverified</span>
        )}
      </div>

      <a
        href={rawUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-auto text-sm font-semibold bg-slate-900 text-white rounded-lg py-2 hover:bg-slate-800 transition-colors text-center"
      >
        View on {marketplace ? marketplace[0].toUpperCase() + marketplace.slice(1) : "store"}
      </a>
    </div>
  );
}

export default MatchCard;
