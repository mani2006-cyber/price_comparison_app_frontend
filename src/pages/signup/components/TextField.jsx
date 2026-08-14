function TextField({ id, label, type = "text", value, onChange, error, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-11 px-4 rounded-2xl border bg-violet-50/40 outline-none focus:ring-4 text-sm font-medium placeholder:text-slate-400 transition-all ${
          error
            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
            : "border-violet-200 focus:border-violet-500 focus:ring-violet-500/10"
        }`}
      />
      {error && <p className="text-xs text-red-600 font-medium mt-1.5">{error}</p>}
    </div>
  );
}

export default TextField;