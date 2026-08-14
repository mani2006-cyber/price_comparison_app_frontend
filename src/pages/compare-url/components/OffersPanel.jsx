import OfferRow from "./OfferRow";
import { formatPrice } from "../../../lib/formatPrice";

function OffersPanel({ results }) {
  const priced = results.filter((r) => r.currentPrice != null);
  if (priced.length === 0) return null;

  const sorted = [...results].sort((a, b) => {
    if (a.currentPrice == null) return 1;
    if (b.currentPrice == null) return -1;
    return a.currentPrice - b.currentPrice;
  });
  const lowestPrice = priced.reduce((min, r) => (r.currentPrice < min ? r.currentPrice : min), priced[0].currentPrice);

  return (
    <div className="card-surface rounded-3xl overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-extrabold text-slate-900">
          Compare {results.length} Available Price{results.length === 1 ? "" : "s"}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Lowest: {formatPrice(lowestPrice, priced[0].currency)}
        </p>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sorted.map((result) => (
          <OfferRow key={`${result.marketplace}-${result.externalId}`} result={result} lowestPrice={lowestPrice} />
        ))}
      </div>
    </div>
  );
}

export default OffersPanel;
