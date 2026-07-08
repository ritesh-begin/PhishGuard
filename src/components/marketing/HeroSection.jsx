import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import URLScanner from '../scanner/URLScanner';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-white via-leapSoft to-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        
        {/* Left aligned hero per guidelines */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-leapRed shadow-sm">
            <ShieldCheck size={16} />
            Check if a link is safe before you click it
          </div>
          
          <h1 className="mt-6 text-4xl font-black tracking-tight text-leapDark sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Detect phishing URLs instantly.
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Paste any suspicious URL below. We'll analyze it using an advanced AI engine and 18+ heuristic rules to spot hidden redirects and brand impersonations.
          </p>

          <div className="mt-10">
            <URLScanner />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
            <p>Don't have a URL?</p>
            <button 
              onClick={() => navigate('/scan/demo-paypal-tk')} 
              className="text-leapRed hover:underline"
            >
              Try a demo scan
            </button>
            <span>•</span>
            <Link to="/resources" className="hover:text-slate-800 hover:underline">
              Learn how to spot fakes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
