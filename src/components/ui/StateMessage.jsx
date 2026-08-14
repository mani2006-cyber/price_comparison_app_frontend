/** Empty/error/not-found placeholder. Pass any icon component from src/components/icons.jsx. */
function StateMessage({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-violet-100 rounded-[2rem] bg-white max-w-md mx-auto shadow-sm animate-in">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-100 to-cyan-glow-400/20 text-violet-500 grid place-items-center mx-auto mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}

export default StateMessage;
