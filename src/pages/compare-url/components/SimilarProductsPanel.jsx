import MatchCard from "./MatchCard";
import Pagination from "../../../components/ui/Pagination";

/**
 * result.similarProducts - related items ranked by title similarity alone,
 * with no price gate, and possibly from the SAME marketplace as the original
 * (a different colour/storage variant, or a related accessory).
 *
 * Deliberately presented as browsing suggestions, not as part of the price
 * comparison above: no "X% cheaper than original" line, because these aren't
 * claimed to be the same product, so a price delta against the original would
 * be a comparison the backend never made. That's why MatchCard is rendered
 * WITHOUT `originalPrice` - it only computes a delta when given one.
 */
function SimilarProductsPanel({ products, page, totalPages, total, onPageChange, loading }) {
  if (!products || products.length === 0) return null;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-extrabold text-slate-900">You might also like</h2>
        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
          {total.toLocaleString("en-IN")} related item{total === 1 ? "" : "s"}
          {totalPages > 1 && ` · page ${page} of ${totalPages}`}
          {" · matched on title, not price"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <MatchCard
            key={`${product.marketplace}-${product.externalId}`}
            product={product}
            style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
          />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={onPageChange} disabled={loading} />
    </section>
  );
}

export default SimilarProductsPanel;
