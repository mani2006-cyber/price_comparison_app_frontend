import { Link } from "react-router-dom";
import MarketplaceBadge from "../../../components/ui/MarketplaceBadge";
import AlertStatusBadge from "./AlertStatusBadge";
import { formatPrice } from "../../../lib/formatPrice";
import { decodeHtml } from "../../../lib/decodeHtml";
import { BoxIcon } from "../../../components/icons";

function AlertItem({ alert, onCancel, cancelling }) {
  const product = alert.productId || {};
  const img = product.images && product.images.length ? product.images[0] : null;
  const productPath = product._id ? `/products/${product._id}` : null;

  return (
    <div className="card-surface rounded-3xl p-4 flex gap-4">
      <Link to={productPath || "#"} className="w-20 h-20 rounded-2xl bg-slate-50 shrink-0 grid place-items-center overflow-hidden">
        {img ? (
          <img src={img} alt={product.title} className="max-h-full max-w-full object-contain p-1.5" loading="lazy" />
        ) : (
          <BoxIcon className="w-7 h-7 text-slate-300" />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MarketplaceBadge marketplace={product.marketplace} />
          <AlertStatusBadge status={alert.status} />
        </div>

        <Link to={productPath || "#"}>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-violet-600 transition-colors">
            {decodeHtml(product.title) || "Untitled product"}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 mt-1.5">
          Target: <span className="font-bold text-slate-700">{formatPrice(alert.targetPrice, product.currency)}</span>
          {product.currentPrice != null && (
            <span className="text-slate-400"> · Now {formatPrice(product.currentPrice, product.currency)}</span>
          )}
        </p>

        {alert.status === "triggered" && alert.triggeredAtPrice != null && (
          <p className="text-xs font-semibold text-emerald-600 mt-1">
            Hit {formatPrice(alert.triggeredAtPrice, product.currency)}
          </p>
        )}
      </div>

      {alert.status === "active" && (
        <button
          onClick={() => onCancel(alert._id)}
          disabled={cancelling}
          title="Cancel alert"
          className="shrink-0 h-8 w-8 grid place-items-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-40 transition-colors cursor-pointer self-start"
        >
          {cancelling ? (
            <span className="text-xs">…</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

export default AlertItem;
