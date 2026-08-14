function SkeletonCard() {
  return (
    <div className="w-full card-surface rounded-3xl p-4 animate-pulse flex flex-col h-[430px]">
      <div className="w-full aspect-square bg-slate-200 rounded-xl mb-3 shrink-0" />
      <div className="flex flex-col flex-1 min-h-0 justify-between">
        <div>
          <div className="h-3 w-16 bg-slate-200 rounded mb-2.5" />
          <div className="space-y-2 mb-3">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 rounded" />
          </div>
          <div className="h-4 w-12 bg-slate-200 rounded mb-2" />
        </div>
        <div>
          <div className="h-6 w-24 bg-slate-200 rounded mb-4" />
          <div className="h-9 w-full bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
