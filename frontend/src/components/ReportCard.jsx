export function ReportCard({ report, onEdit, onSubmit }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-slate-100">Report #{report.id}</p>
          <p className="text-sm text-slate-400">Project {report.project_id}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm ${report.status === 'submitted' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
          {report.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-400">
        <p><span className="font-medium text-slate-200">Completed:</span> {report.tasks_completed}</p>
        <p><span className="font-medium text-slate-200">Planned:</span> {report.tasks_planned}</p>
        <p><span className="font-medium text-slate-200">Hours:</span> {report.hours_worked}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => onEdit(report)} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400">Edit</button>
        {report.status !== 'submitted' && (
          <button onClick={() => onSubmit(report.id)} className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Submit</button>
        )}
      </div>
    </div>
  );
}
