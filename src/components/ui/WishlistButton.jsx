import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { HeartIcon } from "../icons";

/**
 * variant="icon" (default) — compact floating circle, overlaid on product images.
 * variant="full" — labelled full-width button with inline error, used on detail panels.
 */
function WishlistButton({ productId, className = "", variant = "icon" }) {
  const { isAuthenticated } = useAuth();
  const { loaded, isSaved, getSavedItemId, addProduct, removeItem } = useWishlist();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saved = isAuthenticated && isSaved(productId);
  const checking = isAuthenticated && !loaded;

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname + window.location.search } });
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (saved) {
        await removeItem(getSavedItemId(productId));
      } else {
        await addProduct(productId);
      }
    } catch (err) {
      if (variant === "full") setError(err.message);
      // icon variant stays lightweight on cards — errors surface on the full pages.
    } finally {
      setSaving(false);
    }
  }

  if (variant === "full") {
    return (
      <div>
        <button
          onClick={handleClick}
          disabled={checking || saving}
          className={`w-full flex items-center justify-center gap-2 text-sm font-bold rounded-xl py-3 mt-2.5 border transition-colors disabled:opacity-60 cursor-pointer ${
            saved
              ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          } ${className}`}
        >
          <HeartIcon filled={saved} className="w-[18px] h-[18px]" />
          {checking ? "Checking wishlist..." : saved ? "Saved to wishlist" : "Save to wishlist"}
        </button>
        {error && <p className="text-xs text-red-600 font-medium mt-1.5 text-center">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={checking || saving}
      title={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`h-8 w-8 grid place-items-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors disabled:opacity-60 cursor-pointer ${className}`}
    >
      <HeartIcon
        filled={saved}
        className="w-[15px] h-[15px]"
        style={{ color: saved ? "#e11d48" : "#64748b" }}
      />
    </button>
  );
}

export default WishlistButton;
