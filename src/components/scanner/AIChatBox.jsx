import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2, ChevronDown } from 'lucide-react';

export default function AIChatBox({ scanContext }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // On first open, send an automated greeting
  useEffect(() => {
    if (open && messages.length === 0) {
      let greeting = '';
      if (scanContext) {
        if (scanContext.score > 70) {
          greeting = `This URL scored ${scanContext.score}/100 which means it's almost certainly a phishing link. Ask me what any of those indicators mean and I'll explain it in plain English.`;
        } else if (scanContext.score > 45) {
          greeting = `I can see this URL has a score of ${scanContext.score}/100. It's not safe enough to just click without thinking. Want me to explain why?`;
        } else {
          greeting = `This URL looks relatively clean with a score of ${scanContext.score}/100, but there were still a couple of things flagged. Ask me anything about the report!`;
        }
      } else {
        greeting = "Hey! I'm your cybersecurity tutor. Ask me anything about phishing, how to spot fake links, or how this tool works.";
      }

      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // we don't send the greeting (first message) as part of history since it's local-only
          messages: updatedMessages.slice(1), // skip greeting
          scanContext
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError('Network error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What does typosquatting mean?",
    "Why is this URL dangerous?",
    "What should I do if I already clicked it?",
    "Is this actually a phishing link?",
  ];

  return (
    <div className="relative mt-8">
      {/* Collapsed trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-leapRed hover:shadow-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-leapSoft">
            <Bot size={18} className="text-leapRed" />
          </div>
          Ask the AI tutor about this scan
          <ChevronDown size={16} className="ml-auto text-slate-400" />
        </button>
      )}

      {/* Expanded chat panel */}
      {open && (
        <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-leapSoft px-6 py-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leapDark">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-leapDark">AI Security Tutor</p>
              <p className="text-xs text-slate-500">Powered by PhishGuard AI</p>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="ml-auto rounded-lg p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex h-80 flex-col overflow-y-auto p-4 sm:h-96">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                    AI
                  </div>
                )}
                <div className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-md ${
                  msg.role === 'user'
                    ? 'rounded-br-none bg-leapDark text-white'
                    : 'rounded-bl-none bg-slate-100 text-slate-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="mb-4 flex justify-start">
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                  AI
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-none bg-slate-100 px-4 py-3 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            {error && (
              <p className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-xs text-red-600">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggested questions - show only when no user messages yet */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-leapRed hover:text-leapRed"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-3 border-t border-slate-200 px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-leapRed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leapDark text-white transition hover:bg-black disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
