export function DashboardCard({ title, value, subtitle, accent = 'cyan' }) {
  const accentClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-300',
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-300',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-300'
  };

  return (
    <div className={`rounded-3xl border border-slate-800 bg-gradient-to-br ${accentClasses[accent]} p-6 shadow-lg`}>
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}
