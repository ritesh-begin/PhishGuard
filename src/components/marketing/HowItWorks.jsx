import { ClipboardPaste, Cpu, FileText } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <ClipboardPaste className="text-leapRed" size={32} />,
      title: '1. Paste the URL',
      desc: 'Got a sketchy link on WhatsApp or email? Don\'t click it. Just copy and paste it into our scanner.'
    },
    {
      icon: <Cpu className="text-leapRed" size={32} />,
      title: 'Heuristic & AI Analysis',
      desc: 'Our engine instantly checks the link against 18+ heuristic rules and runs a deep AI intent analysis.'
    },
    {
      icon: <FileText className="text-leapRed" size={32} />,
      title: '3. Get the Report',
      desc: 'We\'ll give it a threat score and show you exactly what looks dangerous so you can stay safe.'
    }
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {steps.map((s, idx) => (
        <div key={idx} className="flex flex-col items-start">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            {s.icon}
          </div>
          <h3 className="mt-6 text-xl font-bold text-leapDark">{s.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}
