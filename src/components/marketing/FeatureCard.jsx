export default function FeatureCard({ title, description }) {
  return (
    <article className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-2 w-16 rounded-full bg-leapRed" />
      <h3 className="mt-5 text-xl font-bold text-leapDark">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  )
}
