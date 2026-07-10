import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from '../pages/AuthPage';
import { CreateReportPage } from '../pages/CreateReportPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EditReportPage } from '../pages/EditReportPage';
import { MemberDashboardPage } from '../pages/MemberDashboardPage';
import { ProjectsPage } from '../pages/ProjectsPage';

function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-300">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Navigate to={user.role === 'manager' ? '/dashboard' : '/member/dashboard'} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/register" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['team_member']} />}>
        <Route path="/member/dashboard" element={<MemberDashboardPage />} />
        <Route path="/member/reports/new" element={<CreateReportPage />} />
        <Route path="/member/reports/:id/edit" element={<EditReportPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}