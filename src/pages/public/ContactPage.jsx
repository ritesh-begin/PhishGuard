import { useState } from 'react';
import Footer from '../../components/layout/Footer';
import { Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setStatus({ type: '', msg: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: data.message || 'Message sent!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: data.error || 'Failed to send' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error. Try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = 'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-leapRed';

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <section className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-leapDark sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
              Found a bug? Have a suggestion for a new heuristic rule? Just want to say hi? Drop a message below and I'll get back to you.
            </p>
          </div>

          <div className="mt-10 lg:mt-0">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5">
                <label className="text-sm font-medium text-slate-700">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Your name"
                  />
                  {errors.name && <span className="mt-2 block text-xs text-red-600">{errors.name}</span>}
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="you@example.com"
                  />
                  {errors.email && <span className="mt-2 block text-xs text-red-600">{errors.email}</span>}
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Subject (optional)
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="What is this about?"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Message
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`${fieldClass} resize-none`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && <span className="mt-2 block text-xs text-red-600">{errors.message}</span>}
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-leapRed px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send message'}
              </button>

              {status.msg && (
                <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
                  status.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
                }`}>
                  {status.msg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
