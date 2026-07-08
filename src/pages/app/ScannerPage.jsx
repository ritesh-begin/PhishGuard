import { useState, useEffect } from 'react';
import URLScanner from '../../components/scanner/URLScanner';
import ThreatReport from '../../components/scanner/ThreatReport';
import Footer from '../../components/layout/Footer';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ScannerPage() {
  const [report, setReport] = useState(null);
  const [recentLocal, setRecentLocal] = useState([]);

  useEffect(() => {
    // load last few scans from local storage just to give immediate feedback
    const saved = localStorage.getItem('recentScans');
    if (saved) {
      try {
        setRecentLocal(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleScanComplete = (data) => {
    setReport(data);
    
    // save to local storage for quick access
    const saved = localStorage.getItem('recentScans');
    let history = [];
    if (saved) {
      try {
        history = JSON.parse(saved);
      } catch (e) {}
    }
    
    // don't duplicate
    if (!history.find(h => h.id === data.id)) {
      const newHistory = [data, ...history].slice(0, 5);
      localStorage.setItem('recentScans', JSON.stringify(newHistory));
      setRecentLocal(newHistory);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight text-leapDark sm:text-4xl">
              Phishing URL Scanner
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              Paste a link below. We'll run it through our detection engine and give you a detailed threat report.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <URLScanner onScanComplete={handleScanComplete} />
          </div>

          {report && (
            <div className="mt-16 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <ThreatReport report={report} />
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setReport(null)}
                  className="rounded-xl border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Scan another link
                </button>
              </div>
            </div>
          )}

          {!report && recentLocal.length > 0 && (
            <div className="mx-auto mt-20 max-w-2xl">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <History className="text-slate-400" size={18} />
                <h3 className="text-sm font-semibold text-slate-700">Your recent scans</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {recentLocal.map((item, idx) => (
                  <li key={idx}>
                    <Link to={`/scan/${item.id}`} className="group flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
                      <span className="truncate pr-4 text-sm font-medium text-slate-700 group-hover:text-leapDark">
                        {item.url}
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${
                        item.score > 70 ? 'bg-red-100 text-red-700' :
                        item.score > 45 ? 'bg-orange-100 text-orange-700' :
                        item.score > 20 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.score} / 100
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </main>
  );
}
