function SimilarityMeter({ score }) {
  if (score === null || score === undefined) return null;
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-slate-400";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-bold text-slate-500 shrink-0">{pct}% match</span>
    </div>
  );
}

export default SimilarityMeter;
