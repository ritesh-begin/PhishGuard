import { useState } from 'react';
import Footer from '../../components/layout/Footer';
import { ShieldCheck, ShieldX, BookOpen, ChevronRight } from 'lucide-react';
import AIChatBox from '../../components/scanner/AIChatBox';

const quizQuestions = [
  {
    id: 1,
    question: "You get a WhatsApp message with this link. Safe or phishing?",
    url: "http://login.paypa1.com.verify-account.xyz/secure",
    answer: 'phishing',
    explanation: "This URL has multiple red flags: 'paypa1' replaces the 'l' with '1' (typosquatting), it uses an extremely suspicious .xyz domain, and it asks you to 'verify-account' — a classic urgency tactic."
  },
  {
    id: 2,
    question: "You receive this link in an email from your bank. Is it safe?",
    url: "https://www.hdfc.com/netbanking/login",
    answer: 'safe',
    explanation: "This is a real, properly structured HTTPS URL pointing to hdfc.com directly. The domain is simple, there are no extra subdomains, and it uses HTTPS. Looks fine!"
  },
  {
    id: 3,
    question: "A friend shares this link for a free gift voucher. Safe or phishing?",
    url: "http://bit.ly/3xAmZ0n-giftvoucher",
    answer: 'phishing',
    explanation: "URL shorteners like bit.ly completely hide where you're actually going. Anyone can disguise a dangerous link behind one. The 'giftvoucher' text is also classic phishing bait."
  },
  {
    id: 4,
    question: "You search for Netflix and this URL appears. Safe?",
    url: "https://netf1ix.com/login",
    answer: 'phishing',
    explanation: "Spot the trick: 'netf1ix' replaces the 'l' with '1'. This is a textbook typosquatting attack targeting Netflix users. Always type the domain directly in your browser."
  },
  {
    id: 5,
    question: "You see this in a government email. Safe or phishing?",
    url: "https://income.tax.gov.in/efile",
    answer: 'safe',
    explanation: "This looks legitimate. It's HTTPS, it's on the official .gov.in government domain, and the subdomain structure (income.tax) is consistent with how Indian government portals are structured."
  }
];

// Simple score interpreter
function getScoreMessage(score, total) {
  const pct = (score / total) * 100;
  if (pct === 100) return { msg: "Perfect score! You're a natural at spotting phishing attempts.", color: 'text-green-700' };
  if (pct >= 80) return { msg: "Really solid work. You caught most of them.", color: 'text-green-700' };
  if (pct >= 60) return { msg: "Not bad. A few slipped by but you're getting there.", color: 'text-yellow-700' };
  return { msg: "Phishing links are tricky. Read the explanations carefully and try again!", color: 'text-red-700' };
}

export default function ResourcesPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [answers, setAnswers] = useState([]); // track all answers

  const handleAnswer = (choice) => {
    if (selectedAnswer) return; // don't allow changing

    setSelectedAnswer(choice);
    setShowExplanation(true);

    const correct = choice === quizQuestions[currentQ].answer;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { correct, choice, question: quizQuestions[currentQ] }]);
  };

  const handleNext = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizDone(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setQuizDone(false);
  };

  const q = quizQuestions[currentQ];
  const { msg, color } = quizDone ? getScoreMessage(score, quizQuestions.length) : { msg: '', color: '' };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="flex-1">

        {/* Educational Article Section */}
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <BookOpen className="text-leapRed" size={28} />
            <span className="text-sm font-semibold uppercase tracking-widest text-leapRed">Learn</span>
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-leapDark sm:text-5xl">
            Phishing 101: How to not get hacked
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Phishing is when an attacker sends you a fake message or link trying to trick you into revealing sensitive info. Here is a quick guide on how to spot them.
          </p>

          <hr className="my-10 border-slate-200" />

          <div className="space-y-8 text-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-leapDark">Common Phishing Tricks</h2>
              <p className="mt-4 leading-7">
                Scammers use a few common tricks to make you click without thinking.
                Usually, they try to create a false sense of urgency.
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <span><strong>Typosquatting:</strong> Buying a domain that looks almost exactly like the real thing (e.g., <code className="rounded bg-slate-100 px-1 text-sm">g00gle.com</code> instead of <code className="rounded bg-slate-100 px-1 text-sm">google.com</code>).</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <span><strong>Subdomain abuse:</strong> Using the real brand name as a subdomain on a fake site (e.g., <code className="rounded bg-slate-100 px-1 text-sm">login.paypal.com.secure-update.xyz</code>).</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <span><strong>Hidden links:</strong> Putting text that says "Click here to login" but linking to a completely different IP address.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-leapRed" />
                  <span><strong>URL shorteners:</strong> Hiding the real destination behind bit.ly or tinyurl.com so you can't see where you're actually going.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-leapDark">How to protect yourself</h2>
              <p className="mt-4 leading-7">Before you click a link in an unexpected email or text:</p>
              <ol className="mt-6 list-decimal space-y-4 pl-6">
                <li><strong>Pause.</strong> Is the message urgent and demanding immediate action? That's a red flag.</li>
                <li><strong>Check the sender.</strong> Look at the actual email address, not just the display name.</li>
                <li><strong>Hover before you click.</strong> On a computer, hover your mouse over the link to see the real destination at the bottom of your browser.</li>
                <li><strong>Use a scanner.</strong> If you aren't sure, copy the link and paste it into PhishGuard to get an automated check.</li>
              </ol>
            </div>

            <div className="rounded-2xl bg-leapSoft p-6">
              <h3 className="text-xl font-bold text-leapDark">What if I already clicked it?</h3>
              <p className="mt-4 leading-7">
                If you just clicked the link but didn't enter any info, you are usually fine (unless it downloaded a file).
                If you typed in your password, go to the <em>real</em> website immediately and change it. If you entered credit card info, call your bank.
              </p>
            </div>
          </div>

          {/* AI Chat below article */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-leapDark">Have a question about phishing?</h2>
            <p className="mt-3 text-slate-600">Ask our AI tutor below. It can explain any concept in plain English.</p>
            <div className="mt-4">
              <AIChatBox scanContext={null} />
            </div>
          </div>
        </article>

        {/* SDG 4 Quiz Section */}
        <section className="bg-slate-900 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-400">
                SDG 4 — Quality Education
              </span>
              <h2 className="mt-6 text-3xl font-black text-white sm:text-4xl">
                Test your phishing awareness
              </h2>
              <p className="mt-4 text-slate-400">
                5 real-world scenarios. Can you spot which links are safe and which ones will steal your data?
              </p>
            </div>

            {!quizStarted && !quizDone && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setQuizStarted(true)}
                  className="flex items-center gap-2 rounded-2xl bg-leapRed px-8 py-4 text-base font-semibold text-white transition hover:bg-red-700"
                >
                  Start the quiz <ChevronRight size={20} />
                </button>
              </div>
            )}

            {quizStarted && !quizDone && (
              <div className="mt-10 rounded-[2rem] bg-white p-6 sm:p-10">
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Question {currentQ + 1} of {quizQuestions.length}</span>
                    <span>Score: {score}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-leapRed transition-all duration-500"
                      style={{ width: `${((currentQ) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-leapDark">{q.question}</h3>
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="break-all font-mono text-sm text-slate-700">{q.url}</p>
                </div>

                {!selectedAnswer && (
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <button
                      onClick={() => handleAnswer('safe')}
                      className="flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-green-200 bg-green-50 px-6 py-4 font-semibold text-green-700 transition hover:bg-green-100 hover:border-green-400"
                    >
                      <ShieldCheck size={22} /> This is Safe
                    </button>
                    <button
                      onClick={() => handleAnswer('phishing')}
                      className="flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-red-200 bg-red-50 px-6 py-4 font-semibold text-red-700 transition hover:bg-red-100 hover:border-red-400"
                    >
                      <ShieldX size={22} /> This is Phishing
                    </button>
                  </div>
                )}

                {showExplanation && (
                  <div className={`mt-6 rounded-2xl p-5 ${selectedAnswer === q.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`font-bold ${selectedAnswer === q.answer ? 'text-green-700' : 'text-red-700'}`}>
                      {selectedAnswer === q.answer ? '✓ Correct!' : '✗ Not quite!'}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{q.explanation}</p>

                    <button
                      onClick={handleNext}
                      className="mt-6 flex items-center gap-2 rounded-xl bg-leapDark px-5 py-2 text-sm font-semibold text-white transition hover:bg-black"
                    >
                      {currentQ < quizQuestions.length - 1 ? 'Next question' : 'See my score'}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {quizDone && (
              <div className="mt-10 rounded-[2rem] bg-white p-8 text-center sm:p-12">
                <p className="text-6xl font-black text-leapDark">{score}/{quizQuestions.length}</p>
                <p className={`mt-4 text-base font-semibold ${color}`}>{msg}</p>

                <div className="mt-8 space-y-3 text-left">
                  {answers.map((a, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-xl p-4 ${a.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                      <span className={`shrink-0 text-lg ${a.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {a.correct ? '✓' : '✗'}
                      </span>
                      <div>
                        <p className="text-xs font-mono text-slate-500 break-all">{a.question.url}</p>
                        <p className="mt-1 text-xs text-slate-600">{a.question.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRestart}
                  className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-leapDark shadow-sm transition hover:bg-slate-50"
                >
                  Try again
                </button>
              </div>
            )}

          </div>
        </section>

      </div>
      <Footer />
    </main>
  );
}
