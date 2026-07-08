import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthPage } from '../pages/AuthPage';
import { CreateReportPage } from '../pages/CreateReportPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EditReportPage } from '../pages/EditReportPage';
import { HomePage } from '../pages/HomePage';
import { MemberDashboardPage } from '../pages/MemberDashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/register" element={<AuthPage mode="register" />} />

      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
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
