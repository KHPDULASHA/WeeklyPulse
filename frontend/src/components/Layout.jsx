// import { AIAssistant } from './AiAssistantChat';

// export function Layout({ children }) {
//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       {children}
//       <AIAssistant />
//     </div>
//   );
// }

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AIAssistant } from './AIAssistant';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showHeader = user && !location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {showHeader && (
        <header className="border-b border-slate-800 bg-slate-950/95 px-6 py-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">WeeklyPulse</div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              className="rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm transition hover:border-cyan-400"
            >
              Logout
            </button>
          </div>
        </header>
      )}
      {children}
      <AIAssistant />
    </div>
  );
}