import Footer from '../../components/layout/Footer';
import { highlights, aboutPoints } from '../../data/siteContent';
import { Github, Code } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1 pb-20">
        
        <section className="bg-leapSoft py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black tracking-tight text-leapDark sm:text-5xl">
                About PhishGuard
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                I built this because I kept getting sketchy links on WhatsApp and wanted a quick way to verify them without clicking. It started as a weekend project and grew into a full heuristic scanner.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            
            <div>
              <h2 className="text-2xl font-bold text-leapDark">How the engine works</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Instead of just checking a blocklist (which is usually out of date by the time a new phishing site goes live), PhishGuard actually analyzes the structure of the URL itself.
              </p>
              
              <ul className="mt-8 space-y-4">
                {aboutPoints.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-700">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10">
              <h3 className="text-xl font-bold text-leapDark flex items-center gap-2">
                <Code size={20} /> Tech Stack
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                This project is built to be fast and serverless.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Frontend</span>
                  <span className="text-slate-500">React + Vite + Tailwind CSS</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Backend</span>
                  <span className="text-slate-500">Vercel Serverless Functions</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Database</span>
                  <span className="text-slate-500">MongoDB Atlas</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-leapDark">
                  <Github size={18} /> View on GitHub
                </a>
              </div>
            </div>

          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}
