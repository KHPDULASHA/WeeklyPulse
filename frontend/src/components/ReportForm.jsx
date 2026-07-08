import { useForm } from 'react-hook-form';

export function ReportForm({ defaultValues = {}, onSubmit, submitLabel = 'Save Report', isSubmitting = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-400">Project ID</label>
          <input {...register('project_id', { required: 'Project ID is required' })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" placeholder="1" />
          {errors.project_id && <p className="mt-1 text-sm text-rose-400">{errors.project_id.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Hours worked</label>
          <input type="number" {...register('hours_worked', { required: 'Hours are required', min: 1 })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" placeholder="40" />
          {errors.hours_worked && <p className="mt-1 text-sm text-rose-400">{errors.hours_worked.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-400">Week start</label>
          <input type="date" {...register('week_start', { required: 'Week start is required' })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Week end</label>
          <input type="date" {...register('week_end', { required: 'Week end is required' })} className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-400">Tasks completed</label>
        <textarea {...register('tasks_completed', { required: 'This field is required', minLength: 5 })} className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" />
        {errors.tasks_completed && <p className="mt-1 text-sm text-rose-400">{errors.tasks_completed.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-400">Tasks planned</label>
        <textarea {...register('tasks_planned', { required: 'This field is required', minLength: 5 })} className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" />
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-400">Blockers</label>
        <textarea {...register('blockers')} className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" />
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-400">Notes</label>
        <textarea {...register('notes')} className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3" />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
