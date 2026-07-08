import { useEffect, useState } from 'react';
import { getSessionId } from '../../utils/session';

export default function StatsSection() {
  const [stats, setStats] = useState({ totalScans: 0, threatsFound: 0, safeCount: 0 });

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`/api/stats?sessionId=${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(e => console.error('Failed to load stats', e));
  }, []);

  const statItems = [
    { label: 'Total URLs Scanned', value: stats.totalScans },
    { label: 'Threats Blocked', value: stats.threatsFound },
    { label: 'Safe Links Verified', value: stats.safeCount }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statItems.map((s, idx) => (
        <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft text-center transition hover:-translate-y-1 hover:shadow-lg">
          <p className="text-3xl font-black text-leapDark">{s.value.toLocaleString()}</p>
          <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
