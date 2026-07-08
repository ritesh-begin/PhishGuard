/**
 * POST /api/ai/chat
 * 
 * Body: { messages: [{role, content}], scanContext?: {...} }
 * 
 * The scanContext is optional. If provided, we include a system prompt
 * that tells the AI about the current scan so it can explain it to the user.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, scanContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    return res.status(503).json({ error: 'AI assistant is not configured yet. Please set OPENROUTER_API_KEY.' });
  }

  // Build the system prompt. If we have scan context, explain it.
  let systemContent = `You are a cybersecurity tutor integrated into PhishGuard, a phishing URL detection tool.

Your role is to help users understand:
- Whether a URL is phishing, and WHY
- What specific indicators mean in plain English
- How to protect themselves online

Keep your tone conversational and educational, not robotic. Explain like you're talking to a friend.
Use simple language — the user may not be technically savvy.
If asked about something unrelated to cybersecurity, politely redirect back to the topic.`;

  if (scanContext) {
    systemContent += `\n\n--- CURRENT SCAN RESULT ---
URL: ${scanContext.url}
Threat Score: ${scanContext.score}/100
Verdict: ${scanContext.verdict}
Summary: ${scanContext.summary}

Indicators found:
${(scanContext.indicators || []).map(ind => `- [${ind.severity.toUpperCase()}] ${ind.rule}: ${ind.detail}`).join('\n')}
---

The user is looking at this scan result and may ask you to explain what these indicators mean or whether it's safe to visit.`;
  }

  const systemMessage = {
    role: 'system',
    content: systemContent
  };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Optional: identify ourselves to OpenRouter
        'HTTP-Referer': 'https://phishguard.vercel.app',
        'X-Title': 'PhishGuard AI Tutor',
      },
      body: JSON.stringify({
        model: 'openrouter/free', // dynamically selects an available free model
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 600,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter error:', err);
      return res.status(502).json({ error: 'AI service error. Try again shortly.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({ error: 'No response from AI. Try again.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    return res.status(500).json({ error: 'Server error while contacting AI.' });
  }
}
