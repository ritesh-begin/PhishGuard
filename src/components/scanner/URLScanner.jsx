import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSessionId } from '../../utils/session';

const LOADING_MESSAGES = [
  "Running heuristic analysis...",
  "Sending context to AI...",
  "AI is analyzing domain patterns...",
  "Evaluating threat intent...",
  "Finalizing threat score..."
];

export default function URLScanner({ onScanComplete }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (loading) {
      setMessageIndex(0);
      interval = setInterval(() => {
        setMessageIndex((prev) => Math.min(prev + 1, LOADING_MESSAGES.length - 1));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');

    try {
      const sessionId = getSessionId();
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, sessionId })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // generic fallback if something breaks
        setError(data.error || 'Something went wrong scanning that link.');
        return;
      }

      // If they passed a callback, use it (for inline scanner on Scanner page)
      if (onScanComplete) {
        onScanComplete(data);
      } else {
        // Otherwise, navigate to the scan detail page
        navigate(`/scan/${data.id}`);
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleScan} className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a suspicious link here..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-slate-900 shadow-sm outline-none transition focus:border-leapRed"
          disabled={loading}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 rounded-xl bg-leapDark px-6 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Scan'
            )}
          </button>
        </div>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {loading && (
        <p className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 animate-pulse">
          <Loader2 size={14} className="animate-spin text-slate-400" />
          {LOADING_MESSAGES[messageIndex]}
        </p>
      )}
    </div>
  );
}
