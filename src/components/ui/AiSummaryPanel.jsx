import { SparkleIcon } from "../icons";

/**
 * `result.aiSummary` — a short generated take on which listing is the better
 * deal, from the backend's OpenRouter call.
 *
 * Renders nothing when absent, which is a normal state rather than an error:
 * the backend returns null whenever OPENROUTER_API_KEY isn't set, there were
 * no genuine cross-marketplace matches to compare, or the call failed, timed
 * out, or hit the free model's rate limit. It never blocks the rest of the
 * response, so it must never look like something is missing here either.
 *
 * Deliberately labelled as generated. The algorithmic ranking above it —
 * which listings are matches at all, and their prices — is computed and
 * verifiable; this paragraph is a model's phrasing of it and can be wrong in
 * a way the numbers above aren't. Presenting the two with equal authority
 * would misrepresent both.
 */
function AiSummaryPanel({ summary }) {
  if (!summary) return null;

  return (
    <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-cyan-50/50 p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-lg bg-white text-violet-500 grid place-items-center shrink-0 shadow-sm">
          <SparkleIcon className="w-4 h-4" />
        </span>
        <h2 className="text-sm font-extrabold text-slate-900">The quick take</h2>
        <span className="text-[10px] font-bold uppercase tracking-wide text-violet-500 bg-white/70 rounded-full px-2 py-0.5">
          AI generated
        </span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
    </div>
  );
}

export default AiSummaryPanel;
