import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { createReport } from '../services/reportService';
import { getAllProjects } from '../services/projectService';

export function CreateReportPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const p = await getAllProjects();
        setProjects(p || []);
      } catch (e) {
        // ignore - allow manual project id input
      }
    })();
  }, []);

  const handleCreate = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      await createReport({ ...data, project_id: Number(data.project_id), hours_worked: Number(data.hours_worked) });
      navigate('/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-slate-100">
      <h1 className="text-3xl font-semibold">Create weekly report</h1>
      <p className="mt-2 text-slate-400">Capture your weekly progress and submit it when ready.</p>
      {error && (
        <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}
      <div className="mt-8">
        <ReportForm projects={projects} onSubmit={handleCreate} submitLabel="Create Report" isSubmitting={isSubmitting} />
      </div>
    </main>
  );
}