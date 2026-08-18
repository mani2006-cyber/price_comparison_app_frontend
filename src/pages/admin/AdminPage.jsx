import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  listAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "./api";
import { getCategories } from "../categories/api";
import { KNOWN_CATEGORY_LABELS } from "../categories/categoryCatalog";
import AdminKeyGate from "./components/AdminKeyGate";
import AdminProductForm from "./components/AdminProductForm";
import AdminProductRow from "./components/AdminProductRow";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import StateMessage from "../../components/ui/StateMessage";
import {
  PlusIcon,
  AlertIcon,
  InboxIcon,
  LockIcon,
  GridIcon,
  TrashIcon,
} from "../../components/icons";
import { getAdminKey, clearAdminKey, maskAdminKey } from "../../lib/adminKey";

const PAGE_SIZE = 20;

function AdminPage() {
  // Not held in state on first render only — a stored key means the tab was
  // already unlocked, so a reload shouldn't re-prompt.
  const [unlocked, setUnlocked] = useState(() => Boolean(getAdminKey()));

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publicCategories, setPublicCategories] = useState([]);

  const [editing, setEditing] = useState(undefined); // undefined = closed, null = create
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [flash, setFlash] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAdminProducts({
        category: categoryFilter || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
      // A key that stopped working (rotated server-side) should drop
      // straight back to the gate rather than leaving a dead screen.
      if (err.status === 401) {
        clearAdminKey();
        setUnlocked(false);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, page]);

  useEffect(() => {
    if (unlocked) load();
  }, [unlocked, load]);

  // The public list is active-only, so it's a starting point for the filter
  // rather than the whole truth — merged below with whatever categories the
  // current admin page shows, which is where hidden-only ones surface.
  useEffect(() => {
    if (!unlocked) return;
    getCategories()
      .then((cats) => setPublicCategories(cats.map((c) => c.category)))
      .catch(() => setPublicCategories([]));
  }, [unlocked]);

  const products = useMemo(() => result?.products ?? [], [result]);

  // Categories that actually hold something - what the filter and the stat
  // tile describe. Deliberately NOT padded with the designed names below:
  // a filter offering an empty category, or a count of 15 over an empty
  // catalog, would both be lying about the data.
  const categoryOptions = useMemo(() => {
    const set = new Set(publicCategories);
    products.forEach((p) => p.category && set.add(p.category));
    if (categoryFilter) set.add(categoryFilter);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [publicCategories, products, categoryFilter]);

  // The form's suggestions are a superset: the fifteen names the browse grid
  // has real artwork for are worth offering even before anything is filed
  // under them, so a new catalog gets tiles with icons rather than fallbacks.
  const categorySuggestions = useMemo(
    () => Array.from(new Set([...categoryOptions, ...KNOWN_CATEGORY_LABELS])).sort((a, b) => a.localeCompare(b)),
    [categoryOptions]
  );

  function showFlash(message) {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 3000);
  }

  async function handleSubmit(body) {
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await updateAdminProduct(editing._id, body);
        showFlash("Product updated");
      } else {
        await createAdminProduct(body);
        showFlash("Product added to the catalog");
      }
      setEditing(undefined);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(product) {
    setBusyId(product._id);
    try {
      await updateAdminProduct(product._id, {
        status: product.status === "hidden" ? "active" : "hidden",
      });
      showFlash(product.status === "hidden" ? "Product published" : "Product hidden");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(product) {
    setBusyId(product._id);
    setConfirmDelete(null);
    try {
      await deleteAdminProduct(product._id);
      showFlash("Product deleted");
      // Deleting the only entry on the last page would otherwise leave the
      // view stranded past the end of the list.
      if (products.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  function handleLock() {
    clearAdminKey();
    setUnlocked(false);
    setResult(null);
  }

  if (!unlocked) {
    return <AdminKeyGate onUnlock={() => setUnlocked(true)} />;
  }

  const total = result?.total ?? 0;
  const totalPages = result?.totalPages ?? 0;
  const hiddenOnPage = products.filter((p) => p.status === "hidden").length;

  return (
    <div className="min-h-screen aurora-bg">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-slate-900 mb-1">Catalog admin</h1>
            <p className="text-sm text-slate-400">
              These products are what shoppers browse under{" "}
              <Link to="/categories" className="text-violet-600 font-semibold hover:underline">
                Categories
              </Link>
              .
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => { setEditing(null); setFormError(null); }}>
              <PlusIcon className="w-4 h-4" />
              Add product
            </Button>
            <button
              type="button"
              onClick={handleLock}
              title={`Signed in with ${maskAdminKey(getAdminKey())} — click to forget it`}
              className="h-9 px-3 grid place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              aria-label="Lock admin"
            >
              <LockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <StatTile label={categoryFilter ? "In this category" : "Catalog products"} value={total} />
          <StatTile label="Categories" value={categoryOptions.length} />
          <StatTile
            label="Hidden on this page"
            value={hiddenOnPage}
            className="hidden sm:block"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          <GridIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-full border border-violet-100 bg-white text-slate-600 outline-none focus:border-violet-400 cursor-pointer max-w-full"
          >
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {categoryFilter && (
            <button
              type="button"
              onClick={() => { setCategoryFilter(""); setPage(1); }}
              className="text-xs font-bold text-violet-600 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
          {totalPages > 1 && (
            <span className="text-xs text-slate-400 tabular-nums ml-auto">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {flash && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 text-sm p-3 mb-4 font-semibold animate-in">
            {flash}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 text-red-700 text-sm p-4 mb-5 flex items-center gap-3 font-medium">
            <AlertIcon className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-surface rounded-2xl h-[86px] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <StateMessage
            icon={InboxIcon}
            title={categoryFilter ? "Nothing in this category" : "The catalog is empty"}
            subtitle={
              categoryFilter
                ? "Add a product here, or clear the filter to see everything."
                : "Add your first product — it appears under Categories straight away."
            }
          />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="space-y-2">
            {products.map((product, i) => (
              <AdminProductRow
                key={product._id}
                product={product}
                busy={busyId === product._id}
                onEdit={(p) => { setEditing(p); setFormError(null); }}
                onDelete={setConfirmDelete}
                onToggleStatus={handleToggleStatus}
                style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} disabled={loading} />
      </main>

      {editing !== undefined && (
        <AdminProductForm
          product={editing}
          categories={categorySuggestions}
          onSubmit={handleSubmit}
          onClose={() => setEditing(undefined)}
          saving={saving}
          error={formError}
        />
      )}

      {confirmDelete && (
        <ConfirmDelete
          product={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => handleDelete(confirmDelete)}
        />
      )}
    </div>
  );
}

function StatTile({ label, value, className = "" }) {
  return (
    <div className={`card-surface rounded-2xl px-4 py-3 ${className}`}>
      <p className="text-2xl font-extrabold text-slate-900 tabular-nums leading-tight">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function ConfirmDelete({ product, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-6">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] cursor-default"
      />
      <div className="relative card-surface rounded-3xl p-6 max-w-sm w-full animate-in">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 grid place-items-center mb-4">
          <TrashIcon className="w-6 h-6" />
        </div>
        <h2 className="font-extrabold text-slate-900 mb-1">Delete this product?</h2>
        <p className="text-sm text-slate-500 mb-1 line-clamp-2">{product.title}</p>
        <p className="text-xs text-slate-400 mb-5">
          This is permanent. To take it off the public category page without losing it, hide it
          instead.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-full bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer"
          >
            Delete
          </button>
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
