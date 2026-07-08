import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leapRed text-white">
            <ShieldCheck size={24} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-leapDark">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-leapRed focus:bg-white"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-leapRed focus:bg-white"
            />
          </label>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-leapDark px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

      </div>
    </main>
  );
}
