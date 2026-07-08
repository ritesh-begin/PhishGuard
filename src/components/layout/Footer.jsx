import { NavLink } from 'react-router-dom';
import { navigationLinks } from '../../data/siteContent';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leapRed text-white shadow-soft">
              <span className="font-bold">PG</span>
            </div>
            <h2 className="text-2xl font-bold">PhishGuard</h2>
          </div>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            A tool built to check if links are safe before clicking them. It uses an AI engine and 18+ heuristic rules to spot common phishing tricks and brand impersonations.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:items-start lg:items-end">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Navigation</p>
          <div className="mt-2 flex flex-wrap gap-x-8 gap-y-4 lg:justify-end">
            {navigationLinks.map((item) => (
              <NavLink key={item.path} to={item.path} className="text-sm text-slate-300 transition hover:text-white">
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 w-full lg:text-right">
            <p className="text-sm text-slate-500">Built by Ritesh Kumar Pandit</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
