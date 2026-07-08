import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSessionId } from '../../utils/session';

export default function RecentThreats() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    // Fetch recent dangerous scans
    const sessionId = getSessionId();
    fetch(`/api/scans?limit=3&sessionId=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          // just grab the dangerous ones
          const dangerous = data.data.filter(s => s.verdict === 'Dangerous' || s.verdict === 'Suspicious');
          setThreats(dangerous.slice(0, 3));
        }
      })
      .catch(e => console.error(e)); // silent fail is fine here
  }, []);

  if (threats.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <ShieldAlert className="text-leapRed" size={24} />
        <h3 className="text-lg font-bold text-leapDark">Your Recent Threats</h3>
      </div>
      
      <div className="mt-6 space-y-4">
        {threats.map(t => (
          <Link key={t._id} to={`/scan/${t._id}`} className="group block rounded-2xl border border-slate-100 p-4 transition hover:border-leapRed hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="truncate pr-4 text-sm font-medium text-slate-700 group-hover:text-leapRed">
                {t.url}
              </p>
              <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                Score: {t.score}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Found {t.indicators.length} indicators • {new Date(t.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
