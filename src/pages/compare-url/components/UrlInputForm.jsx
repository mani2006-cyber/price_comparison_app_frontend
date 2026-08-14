import Button from "../../../components/ui/Button";
import { LinkIcon } from "../../../components/icons";

function UrlInputForm({ value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="card-surface rounded-3xl p-4 sm:p-5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
        Product URL
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type="url"
            required
            placeholder="Paste a product link from Amazon, Flipkart, Myntra, Lenskart, Nykaa, Poorvika or Vijay Sales..."
            className="w-full h-11 pl-10 pr-4 rounded-full border border-violet-100 bg-violet-50/40 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium placeholder:text-slate-400 transition-all"
          />
        </div>
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? "Comparing..." : "Compare"}
        </Button>
      </div>
    </form>
  );
}

export default UrlInputForm;
