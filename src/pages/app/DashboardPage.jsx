import { useEffect, useState } from 'react';
import Footer from '../../components/layout/Footer';
import StatsSection from '../../components/dashboard/StatsSection';
import RecentThreats from '../../components/dashboard/RecentThreats';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex-1 pb-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-leapDark">Personal Dashboard</h1>
            <p className="mt-2 text-slate-600">Your personal scan statistics and recent threat activity.</p>
          </div>

          <StatsSection />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* Left side: threat breakdown or something */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-10">
              <h3 className="text-lg font-bold text-leapDark">How the scanner works</h3>
              <p className="mt-4 leading-7 text-slate-600">
                PhishGuard doesn't rely on blocklists because new phishing domains are registered every second. Instead, we use a heuristic engine.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <p className="text-sm text-slate-700"><strong>Lexical Analysis:</strong> Checks for strange characters, IP addresses, and extreme URL lengths.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <p className="text-sm text-slate-700"><strong>Brand Impersonation:</strong> Detects if a domain is trying to look like Google, PayPal, Amazon, etc. (typosquatting).</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <p className="text-sm text-slate-700"><strong>Structure Checks:</strong> Flags unusually deep subdomains and non-standard ports.</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/resources" className="inline-flex items-center text-sm font-semibold text-leapRed hover:underline">
                  Read more in our resources <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Right side: recent threats */}
            <div>
              <RecentThreats />
              
              <div className="mt-4 text-center">
                <Link to="/history" className="text-sm font-medium text-slate-500 hover:text-leapRed hover:underline">
                  View full scan history
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}
