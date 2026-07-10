import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReportCard } from '../components/ReportCard';
import { ReportTable } from '../components/ReportTable';
import { getMyReports, submitReport } from '../services/reportService';

export function MemberDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (id) => {
    try {
      await submitReport(id);
      await loadReports();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to submit report');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 text-slate-100">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Team Member Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold">Weekly report center</h1>
          <p className="mt-2 text-slate-400">Create, edit, submit, and review your weekly reports from one place.</p>
        </div>

        <div className="flex gap-2">
          <Link to="/member/reports/new" className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
            New report
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/auth/login');
            }}
            className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm transition hover:border-cyan-400"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-center text-slate-300">
          Loading your reports...
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 xl:grid-cols-2">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onEdit={() => navigate(`/member/reports/${report.id}/edit`)}
                onSubmit={handleSubmit}
              />
            ))}
          </div>
          <ReportTable reports={reports} onEdit={(report) => navigate(`/member/reports/${report.id}/edit`)} onSubmit={handleSubmit} />
        </div>
      )}
    </main>
  );
}