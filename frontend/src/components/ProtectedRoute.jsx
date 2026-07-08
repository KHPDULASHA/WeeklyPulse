import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-300">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'manager' ? '/dashboard' : '/member/dashboard'} replace />;
  }

  return <Outlet />;
}
