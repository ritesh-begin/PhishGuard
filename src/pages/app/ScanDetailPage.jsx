import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ThreatReport from '../../components/scanner/ThreatReport';
import Footer from '../../components/layout/Footer';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ScanDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/scan/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setReport(data);
      })
      .catch(e => setError('Failed to load scan.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 pb-20">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          
          <Link to="/history" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-leapDark">
            <ArrowLeft size={16} /> Back to History
          </Link>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 size={32} className="animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              <p className="font-bold">Error</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : report ? (
            <div className="animate-in fade-in duration-500">
              <ThreatReport report={report} />
            </div>
          ) : null}

        </div>
      </div>
      <Footer />
    </main>
  );
}
