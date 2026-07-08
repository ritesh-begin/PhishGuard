import { useState, useEffect } from 'react';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { Loader2, Trash2 } from 'lucide-react';
import { getSessionId } from '../../utils/session';

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchScans = async (pageNum) => {
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const res = await fetch(`/api/scans?page=${pageNum}&limit=15&sessionId=${sessionId}`);
      const data = await res.json();
      
      if (res.ok) {
        setScans(data.data);
        setTotalPages(data.pagination.pages);
      } else {
        setError(data.error || 'Failed to load');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scan from your history?')) return;
    
    try {
      const sessionId = getSessionId();
      const res = await fetch(`/api/scan/${id}?sessionId=${sessionId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setScans(scans.filter(s => s._id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const getVerdictStyle = (verdict) => {
    if (verdict === 'Dangerous') return 'bg-red-100 text-red-700';
    if (verdict === 'Suspicious') return 'bg-orange-100 text-orange-700';
    if (verdict === 'Low Risk') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-leapDark">Your Scan History</h1>
            <p className="mt-2 text-slate-600">These scans are private to this device.</p>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 size={32} className="animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">URL</th>
                      <th className="px-6 py-4 font-semibold">Verdict</th>
                      <th className="px-6 py-4 font-semibold">Score</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scans.map(s => (
                      <tr key={s._id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          <div className="max-w-[300px] md:max-w-[500px] truncate">{s.url}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getVerdictStyle(s.verdict)}`}>
                            {s.verdict}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{s.score}</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right flex justify-end items-center gap-3">
                          <Link to={`/scan/${s._id}`} className="font-semibold text-leapDark hover:underline">
                            Details
                          </Link>
                          <button 
                            onClick={() => handleDelete(s._id)}
                            className="text-slate-400 hover:text-red-600 transition"
                            title="Delete scan"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Prev
              </button>
              <span className="flex items-center px-4 text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </main>
  );
}
