import MarketplaceAvatar from "../../../components/ui/MarketplaceAvatar";
import { marketplaceStyle } from "../../../lib/marketplace";
import { formatPrice } from "../../../lib/formatPrice";
import { ChevronRightIcon } from "../../../components/icons";

function OfferRow({ result, lowestPrice }) {
  const { marketplace, currentPrice, currency, rawUrl, delivery } = result;
  const style = marketplaceStyle(marketplace);
  const isLowest = currentPrice === lowestPrice;
  const percentHigher =
    !isLowest && currentPrice != null && lowestPrice ? Math.round(((currentPrice - lowestPrice) / lowestPrice) * 100) : null;

  const deliveryText = delivery && delivery.free ? "Free delivery" : (delivery && delivery.estimate) || null;

  return (
    <a
      href={rawUrl}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 last:border-b-0 transition-colors ${
        isLowest ? "bg-emerald-50/60 hover:bg-emerald-50" : "hover:bg-slate-50"
      }`}
    >
      <MarketplaceAvatar marketplace={marketplace} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{style.label}</p>
        {deliveryText && <p className="text-xs text-slate-400 truncate">{deliveryText}</p>}
      </div>

      <div className="text-right shrink-0">
        {currentPrice != null ? (
          <p className="text-sm font-extrabold text-slate-900">{formatPrice(currentPrice, currency)}</p>
        ) : (
          <p className="text-sm font-semibold text-slate-300">Unavailable</p>
        )}
        {isLowest && currentPrice != null && <p className="text-[11px] font-bold text-emerald-600">Lowest price</p>}
        {percentHigher != null && percentHigher >= 1 && (
          <p className="text-[11px] font-bold text-amber-600">{percentHigher}% Higher</p>
        )}
      </div>

      <ChevronRightIcon className="w-4 h-4 text-slate-300 shrink-0" />
    </a>
  );
}

export default OfferRow;
