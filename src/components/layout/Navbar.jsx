import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { navigationLinks } from '../../data/siteContent';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-leapRed' : 'text-slate-700 hover:text-leapRed'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leapRed text-white shadow-soft">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leapMuted">Project</p>
            <p className="text-base font-bold text-leapDark">PhishGuard</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:border-leapRed hover:text-leapRed md:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
            {navigationLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-leapSoft text-leapRed' : 'text-slate-700 hover:bg-slate-50 hover:text-leapRed'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
