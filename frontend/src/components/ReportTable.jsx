export function ReportTable({ rows = [], reports = [], onEdit, onSubmit }) {
  const data = rows.length ? rows : reports;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-950/70 text-slate-300">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Hours</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {data.map((item, index) => {
              const key = item.id || `${item.employee || item.project || 'row'}-${index}`;
              const isMemberReport = Boolean(item.project_id || item.tasks_completed);

              return (
                <tr key={key} className="hover:bg-slate-800/60">
                  <td className="px-4 py-3">
                    {isMemberReport ? `Report #${item.id}` : item.employee || item.project || 'Row'}
                  </td>
                  <td className="px-4 py-3">{item.status || item.role || '—'}</td>
                  <td className="px-4 py-3">{item.hours_worked || item.hours || '—'}</td>
                  <td className="px-4 py-3">
                    {isMemberReport ? (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => onEdit?.(item)} className="rounded-xl border border-slate-700 px-3 py-2 text-sm hover:border-cyan-400">Edit</button>
                        {item.status !== 'submitted' && (
                          <button onClick={() => onSubmit?.(item.id)} className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">Submit</button>
                        )}
                      </div>
                    ) : (
                      item.blockers || item.project || 'No additional details'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
