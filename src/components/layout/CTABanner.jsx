import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-leapDark px-6 py-10 shadow-soft sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Stay Safe</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Not sure about a link? Let's check it.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                It takes two seconds and it's completely free. Don't risk your credentials on a sketchy login page.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                to="/scanner"
                className="inline-flex items-center justify-center rounded-2xl bg-leapRed px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Scan a URL
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-leapDark"
              >
                Read the guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
