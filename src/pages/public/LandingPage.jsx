import HeroSection from '../../components/marketing/HeroSection';
import HowItWorks from '../../components/marketing/HowItWorks';
import StatsSection from '../../components/dashboard/StatsSection';
import RecentThreats from '../../components/dashboard/RecentThreats';
import TestimonialSection from '../../components/marketing/TestimonialSection';
import CTABanner from '../../components/layout/CTABanner';
import NewsletterSection from '../../components/marketing/NewsletterSection';
import Footer from '../../components/layout/Footer';
import { features, testimonials } from '../../data/siteContent';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />

      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-leapDark sm:text-4xl">
              Don't guess. Know if it's safe.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Scammers are getting smarter, but so are our detection tools. Here is how it works.
            </p>
          </div>
          
          <div className="mt-16">
            <HowItWorks />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leapRed">Your Activity</p>
            <h2 className="mt-3 text-3xl font-bold text-leapDark">Personal stats</h2>
          </div>
          
          <StatsSection />

          <div className="mt-16">
            <RecentThreats />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold text-leapDark">Features</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold text-leapDark">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialSection testimonials={testimonials} />
      
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewsletterSection />
        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  );
}
