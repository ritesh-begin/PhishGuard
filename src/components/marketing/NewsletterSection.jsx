import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', msg: data.message });
        setEmail('');
      } else {
        setStatus({ type: 'error', msg: data.error });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-leapSoft p-8 sm:p-12 text-center">
      <h3 className="text-2xl font-bold text-leapDark">Get security tips in your inbox</h3>
      <p className="mt-3 text-slate-600">We send one email a month with new phishing trends to watch out for.</p>
      
      <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-leapRed"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex h-[46px] items-center justify-center rounded-2xl bg-leapDark px-6 font-semibold text-white transition hover:bg-black disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Subscribe'}
        </button>
      </form>
      
      {status.msg && (
        <p className={`mt-4 text-sm font-medium ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
}
