import { AlertTriangle, CheckCircle, ShieldAlert, Info, Link2 } from 'lucide-react';
import ThreatScoreGauge from './ThreatScoreGauge';
import AIChatBox from './AIChatBox';

export default function ThreatReport({ report }) {
  if (!report) return null;

  const { score, verdict, indicators, summary, url, scannedAt } = report;

  let VerdictIcon = CheckCircle;
  let verdictColor = 'text-threatSafe bg-green-50 border-green-200';
  
  if (score > 70) {
    VerdictIcon = ShieldAlert;
    verdictColor = 'text-threatHigh bg-red-50 border-red-200';
  } else if (score > 45) {
    VerdictIcon = AlertTriangle;
    verdictColor = 'text-threatMedium bg-orange-50 border-orange-200';
  } else if (score > 20) {
    VerdictIcon = Info;
    verdictColor = 'text-threatLow bg-yellow-50 border-yellow-200';
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">Critical</span>;
      case 'high':
        return <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">High</span>;
      case 'medium':
        return <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-700">Medium</span>;
      default:
        return <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">Low</span>;
    }
  };

  return (
    <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
      <div className="grid gap-10 md:grid-cols-[auto_1fr]">
        
        {/* Left Col: Score & Verdict */}
        <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
          <ThreatScoreGauge score={score} />
          
          <div className={`mt-6 flex items-center gap-2 rounded-2xl border px-4 py-2 ${verdictColor}`}>
            <VerdictIcon size={20} />
            <span className="font-bold">{verdict}</span>
          </div>
          
          {scannedAt && (
            <p className="mt-4 text-xs text-slate-400">
              Scanned: {new Date(scannedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Right Col: Details */}
        <div>
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
            <Link2 className="mt-1 shrink-0 text-slate-400" size={20} />
            <p className="break-all text-sm font-medium text-slate-700">{url}</p>
          </div>

          <p className="text-base leading-7 text-slate-600">{summary}</p>

          <div className="mt-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Indicators Found ({indicators?.length || 0})
            </h3>
            
            {indicators?.length === 0 ? (
              <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                No suspicious indicators found. The URL looks completely clean based on our rules.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {indicators?.map((ind, idx) => (
                  <li key={idx} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{ind.rule}</p>
                      <p className="mt-1 text-sm text-slate-600">{ind.detail}</p>
                    </div>
                    <div className="shrink-0">
                      {getSeverityBadge(ind.severity)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* AI Tutor Chat - below the main report */}
      <div className="mt-8 border-t border-slate-100 pt-8">
        <AIChatBox scanContext={{ url, score, verdict, summary, indicators }} />
      </div>
    </div>
  );
}
