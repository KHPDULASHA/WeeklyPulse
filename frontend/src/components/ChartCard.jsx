export function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="h-72">
        {children}
      </div>
    </div>
  );
}
