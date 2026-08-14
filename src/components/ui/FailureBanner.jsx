import { marketplaceStyle } from "../../lib/marketplace";
import { AlertIcon } from "../icons";

/** Surfaces `marketplaceFailures` from a search/compare response - one store
 * erroring shouldn't look like the whole request failed. */
function FailureBanner({ failures }) {
  if (!failures || failures.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs p-3 flex items-start gap-2">
      <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
      <span>
        Couldn't check{" "}
        {failures.map((f, i) => (
          <span key={f.marketplace || i} className="font-semibold">
            {marketplaceStyle(f.marketplace).label}
            {i < failures.length - 1 ? ", " : ""}
          </span>
        ))}
        . Prices from that store may be missing.
      </span>
    </div>
  );
}

export default FailureBanner;
