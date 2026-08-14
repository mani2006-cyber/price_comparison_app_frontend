import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAlerts } from "../../context/AlertContext";
import { formatPrice } from "../../lib/formatPrice";
import { BellIcon } from "../icons";
import Button from "./Button";

/**
 * Inline "notify me when the price drops" control. Shown on product detail /
 * compare-hero panels alongside the wishlist button. Progressive disclosure:
 * collapsed to a single button until the user opts in, per the skill's Forms
 * guidance (validate on blur, clear loading -> success/error feedback).
 */
function AlertControl({ productId, currentPrice, currency, className = "" }) {
  const { isAuthenticated } = useAuth();
  const { getActiveAlert, addAlert, removeAlert } = useAlerts();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState("");
  const [fieldError, setFieldError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const activeAlert = productId ? getActiveAlert(productId) : null;

  function handleOpen() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname + window.location.search } });
      return;
    }
    setFormError(null);
    setOpen(true);
  }

  function validate(value) {
    const num = Number(value);
    if (!value || Number.isNaN(num)) return "Enter a target price";
    if (num <= 0) return "Must be a positive number";
    if (currentPrice != null && num >= currentPrice) return `Must be below the current price (${formatPrice(currentPrice, currency)})`;
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate(targetPrice);
    setFieldError(err);
    if (err) return;

    setFormError(null);
    setSubmitting(true);
    try {
      await addAlert(productId, Number(targetPrice));
      setOpen(false);
      setTargetPrice("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    if (!activeAlert) return;
    setCancelling(true);
    try {
      await removeAlert(activeAlert._id);
    } catch {
      // Non-fatal: the alert just stays visible as active until the user retries.
    } finally {
      setCancelling(false);
    }
  }

  if (activeAlert) {
    return (
      <div className={`flex items-center justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 mt-2.5 ${className}`}>
        <span className="text-sm font-semibold text-violet-700 flex items-center gap-2 min-w-0">
          <BellIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">Alert set at {formatPrice(activeAlert.targetPrice, currency)}</span>
        </span>
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="text-xs font-bold text-violet-600 hover:text-violet-800 shrink-0 cursor-pointer disabled:opacity-50"
        >
          {cancelling ? "Removing..." : "Remove"}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className={`btn-secondary w-full h-11 mt-2.5 text-sm ${className}`}
      >
        <BellIcon className="w-4 h-4" />
        Set a price alert
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl border border-violet-100 bg-violet-50/40 p-3.5 mt-2.5 ${className}`}>
      <label htmlFor={`alert-target-${productId}`} className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
        Notify me when price drops to
      </label>
      <div className="flex gap-2">
        <input
          id={`alert-target-${productId}`}
          type="number"
          inputMode="decimal"
          min="1"
          step="1"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          onBlur={() => setFieldError(validate(targetPrice))}
          placeholder={currentPrice != null ? `Below ${formatPrice(currentPrice, currency)}` : "Target price"}
          className={`w-full h-10 px-4 rounded-full border bg-white outline-none focus:ring-4 text-sm font-medium placeholder:text-slate-400 transition-all ${
            fieldError ? "border-red-300 focus:border-red-400 focus:ring-red-500/10" : "border-violet-200 focus:border-violet-500 focus:ring-violet-500/10"
          }`}
        />
        <Button type="submit" size="sm" disabled={submitting} className="shrink-0">
          {submitting ? "Setting..." : "Set"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-ghost h-10 px-3 text-sm shrink-0"
        >
          Cancel
        </button>
      </div>
      {fieldError && <p className="text-xs text-red-600 font-medium mt-1.5">{fieldError}</p>}
      {formError && !fieldError && <p className="text-xs text-red-600 font-medium mt-1.5">{formError}</p>}
    </form>
  );
}

export default AlertControl;
