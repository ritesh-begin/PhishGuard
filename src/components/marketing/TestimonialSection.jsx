export default function TestimonialSection({ testimonials }) {
  // simple avatar placeholder function for some visual variety
  const getAvatarLetter = (name) => name.charAt(0).toUpperCase();

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-leapDark sm:text-4xl">
            Why people use it
          </h2>
        </div>
        
        {/* Card based layout instead of plain blockquotes */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="flex-1 text-sm leading-7 text-slate-700">
                "{item.quote}"
              </p>
              
              <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                  {getAvatarLetter(item.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
