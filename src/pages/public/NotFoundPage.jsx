import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer'

export default function NotFoundPage() {
  return (
    <main>
      <section className="bg-slate-50">
        <div className="mx-auto flex min-h-[75vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leapRed">404</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-leapDark sm:text-5xl">
            Nothing here.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            The page you opened does not exist. Use the button below to go back to the homepage.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-leapDark px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
          >
            Go back home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
