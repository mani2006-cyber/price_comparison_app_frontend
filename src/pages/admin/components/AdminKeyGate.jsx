import { useState } from "react";
import { LockIcon, AlertIcon } from "../../../components/icons";
import Button from "../../../components/ui/Button";
import { setAdminKey, clearAdminKey } from "../../../lib/adminKey";
import { verifyAdminKey } from "../api";

/**
 * The key prompt in front of /admin. Verifies against the API before
 * letting anything render — a wrong key that only failed later would look
 * like "the catalog is empty" rather than "you're not authenticated".
 */
function AdminKeyGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    setChecking(true);
    setError(null);
    // Stored before the probe because api.js reads the key from storage
    // rather than taking it as an argument — cleared again on failure so a
    // rejected key never lingers for the next request to reuse.
    setAdminKey(trimmed);

    try {
      await verifyAdminKey();
      onUnlock();
    } catch (err) {
      clearAdminKey();
      setError(
        err.status === 401
          ? "That admin key was rejected. Check it against ADMIN_API_KEY in the backend .env."
          : err.status === 500
          ? "The server has no ADMIN_API_KEY configured, so every admin route refuses requests. Set it in the backend .env and restart."
          : err.message
      );
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen aurora-bg grid place-items-center px-6 py-16">
      <div className="w-full max-w-md animate-in">
        <div className="card-surface rounded-[2rem] p-8">
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-white mb-5"
            style={{
              backgroundImage: "linear-gradient(135deg, #7c5cfc 0%, #22d3ee 100%)",
              boxShadow: "0 8px 20px -6px rgba(124, 92, 252, 0.55)",
            }}
          >
            <LockIcon className="w-7 h-7" />
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 mb-1">Catalog admin</h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter the admin key to manage the products behind category browsing.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="admin-key" className="block text-xs font-bold text-slate-600 mb-1.5">
              Admin key
            </label>
            <input
              id="admin-key"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="x-admin-key"
              className="w-full h-11 px-4 rounded-xl border border-violet-100 bg-white text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition font-mono"
            />

            {error && (
              <div className="mt-3 rounded-xl border border-red-100 bg-red-50 text-red-700 text-xs p-3 flex items-start gap-2 font-medium">
                <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" disabled={checking || !value.trim()} className="w-full mt-4">
              {checking ? "Checking…" : "Unlock"}
            </Button>
          </form>
        </div>

        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed px-1">
          The key is kept in this tab only and forgotten when you close it. It is deliberately
          never stored in the app's build config — a <code className="font-mono">VITE_</code> variable
          would ship this shared secret inside the JavaScript every visitor downloads.
        </p>
      </div>
    </div>
  );
}

export default AdminKeyGate;
