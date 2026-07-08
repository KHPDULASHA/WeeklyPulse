import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportForm } from '../components/ReportForm';
import { getMyReports, updateReport } from '../services/reportService';

export function EditReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadReport() {
      try {
        const reports = await getMyReports();
        const selected = reports.find((item) => item.id === Number(id));
        if (!selected) {
          throw new Error('Report not found');
        }
        setReport(selected);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Unable to load report');
      }
    }

    loadReport();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      await updateReport(Number(id), { ...data, project_id: Number(data.project_id), hours_worked: Number(data.hours_worked) });
      navigate('/member/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update report');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) {
    return <div className="mx-auto max-w-5xl px-6 py-16 text-slate-300">Loading report...</div>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-slate-100">
      <h1 className="text-3xl font-semibold">Edit report</h1>
      <p className="mt-2 text-slate-400">Adjust details before submitting your weekly update.</p>
      {error && <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
      <div className="mt-8">
        <ReportForm defaultValues={report} onSubmit={handleUpdate} submitLabel="Update Report" isSubmitting={isSubmitting} />
      </div>
    </main>
  );
}
