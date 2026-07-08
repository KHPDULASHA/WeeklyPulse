import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const { login, register: registerUser } = useAuth();
  const [formMode, setFormMode] = useState(mode);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setError('');
      if (formMode === 'login') {
        await login({ email: data.email, password: data.password });
      } else {
        await registerUser({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          role_name: data.role_name
        });
      }
      const nextRoute = (await (formMode === 'login' ? login({ email: data.email, password: data.password }) : registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        role_name: data.role_name
      }))).role === 'manager' ? '/dashboard' : '/member/dashboard';
      navigate(nextRoute);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#020617,_#111827)] px-4 py-16 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-cyan-950/40 lg:flex-row">
        <div className="flex-1 bg-slate-950/60 p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">WeeklyPulse</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Stay aligned. Report clearly. Lead confidently.</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-400">
            A modern workspace for team members and managers to track weekly progress and collaborate with clarity.
          </p>
          <div className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">Secure JWT-based session handling</div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">Responsive SaaS-style experience</div>
          </div>
        </div>

        <div className="flex-1 p-8 sm:p-12">
          <div className="mb-6 flex rounded-full border border-slate-800 bg-slate-950/70 p-1 text-sm">
            <button type="button" onClick={() => setFormMode('login')} className={`flex-1 rounded-full px-4 py-2 transition ${formMode === 'login' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}>
              Login
            </button>
            <button type="button" onClick={() => setFormMode('register')} className={`flex-1 rounded-full px-4 py-2 transition ${formMode === 'register' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formMode === 'register' && (
              <div>
                <input
                  {...register('full_name', { required: 'Full name is required' })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none ring-0 transition focus:border-cyan-500"
                  placeholder="Full name"
                />
                {errors.full_name && <p className="mt-1 text-sm text-rose-400">{errors.full_name.message}</p>}
              </div>
            )}

            <div>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-500"
                placeholder="Email address"
              />
              {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>}
            </div>

            <div>
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-500"
                placeholder="Password"
              />
              {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>}
            </div>

            {formMode === 'register' && (
              <div>
                <select {...register('role_name')} className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 outline-none transition focus:border-cyan-500">
                  <option value="team_member">Team Member</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            )}

            {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

            <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? 'Please wait...' : formMode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
