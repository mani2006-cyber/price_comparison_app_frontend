import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import { XIcon, AlertIcon, BoxIcon } from "../../../components/icons";
import { formatPrice } from "../../../lib/formatPrice";

const EMPTY = { title: "", description: "", category: "", price: "", image: "", status: "active" };

/**
 * Create/edit panel for one catalog entry. `product` null means create.
 *
 * `categories` seeds the category datalist so an admin picks an existing
 * name rather than inventing "Electronics and Gadgets" alongside
 * "Electronics & Gadgets" — the backend groups categories case-
 * insensitively, but not spelling-insensitively, and a typo silently
 * creates a whole new category tile on the public browse page.
 */
function AdminProductForm({ product, categories, onSubmit, onClose, saving, error }) {
  const [form, setForm] = useState(EMPTY);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setForm(
      product
        ? {
            title: product.title || "",
            description: product.description || "",
            category: product.category || "",
            price: product.price != null ? String(product.price) : "",
            image: product.image || "",
            status: product.status || "active",
          }
        : EMPTY
    );
    setTouched(false);
  }, [product]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const priceNumber = Number(form.price);
  const priceValid = form.price !== "" && Number.isFinite(priceNumber) && priceNumber > 0;
  const canSubmit = form.title.trim() && form.category.trim() && priceValid;

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    // Blank optional fields are omitted rather than sent as "". The
    // backend's Zod schema types description/image as a non-empty string
    // when present, so "" is a 400 — and on PATCH there is currently no
    // way to clear one back to empty at all, only to overwrite it.
    const body = {
      title: form.title.trim(),
      category: form.category.trim(),
      price: priceNumber,
      status: form.status,
    };
    if (form.description.trim()) body.description = form.description.trim();
    if (form.image.trim()) body.image = form.image.trim();

    onSubmit(body);
  }

  const showError = (field) => touched && !String(form[field]).trim();

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-violet-100 bg-white text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition";
  const labelClass = "block text-xs font-bold text-slate-600 mb-1.5";

  return (
    // Fixed overlay + right-hand panel: editing sits on top of the table
    // rather than replacing it, so the list you were working through stays
    // where it was when the panel closes.
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] cursor-default"
      />

      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-in">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-violet-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900">
            {product ? "Edit product" : "Add product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="h-9 w-9 grid place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="f-title" className={labelClass}>
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="f-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Sony WH-1000XM5 Wireless Headphones"
              className={inputClass}
            />
            {/* Not a cosmetic label: the title is the literal query used for
                the live marketplace search when a shopper clicks this card. */}
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Used verbatim as the search query when a shopper clicks this card, so a full
              product name finds far better listings than a generic one.
            </p>
            {showError("title") && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">A title is required.</p>
            )}
          </div>

          <div>
            <label htmlFor="f-category" className={labelClass}>
              Category <span className="text-rose-500">*</span>
            </label>
            <input
              id="f-category"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              list="admin-category-options"
              placeholder="Electronics & Gadgets"
              className={inputClass}
            />
            <datalist id="admin-category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            {showError("category") && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">A category is required.</p>
            )}
          </div>

          <div>
            <label htmlFor="f-price" className={labelClass}>
              Reference price (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              id="f-price"
              type="number"
              min="1"
              step="1"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="29990"
              className={inputClass}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Shown on the catalog card only — live marketplace prices come from the search this
              product triggers, not from here.
              {priceValid && (
                <span className="text-slate-500 font-semibold"> Displays as {formatPrice(priceNumber, "INR")}.</span>
              )}
            </p>
            {touched && !priceValid && (
              <p className="text-[11px] text-rose-500 font-semibold mt-1">
                Enter a price greater than zero.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="f-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="f-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Industry-leading noise cancellation, 30-hour battery."
              className={`${inputClass} h-auto py-3 resize-y`}
            />
          </div>

          <div>
            <label htmlFor="f-image" className={labelClass}>
              Image URL
            </label>
            <input
              id="f-image"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://…"
              className={inputClass}
            />
            <div className="mt-2 rounded-xl bg-slate-50 border border-violet-100 aspect-video grid place-items-center overflow-hidden">
              {form.image.trim() ? (
                <img
                  src={form.image.trim()}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                  // A URL that 404s otherwise shows a browser's broken-image
                  // glyph, which reads as "the form is broken".
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />
              ) : (
                <div className="text-center text-slate-300">
                  <BoxIcon className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-[11px] font-semibold">No image — cards show a category tile</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <span className={labelClass}>Visibility</span>
            <div className="flex gap-2">
              {[
                { value: "active", label: "Published", hint: "Visible in category browsing" },
                { value: "hidden", label: "Hidden", hint: "Draft — admin only" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set("status", opt.value)}
                  title={opt.hint}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer ${
                    form.status === opt.value
                      ? "border-violet-400 bg-violet-50 text-violet-700"
                      : "border-violet-100 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 text-xs p-3 flex items-start gap-2 font-medium">
              <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving…" : product ? "Save changes" : "Add product"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminProductForm;
