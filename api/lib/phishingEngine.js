/**
 * Core Phishing Detection Engine (AI-Powered)
 * 
 * Architecture:
 * 1. Run heuristic rules to gather technical signals (fast, deterministic).
 * 2. Send the URL + heuristic context to an LLM via OpenRouter for deep analysis.
 * 3. The AI returns a unified score, verdict, indicators, and summary.
 * 4. If the AI call fails for any reason, we gracefully fall back to the heuristic result.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// ─── Constants ─────────────────────────────────────────────────────────────────

const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz', '.cc', '.su', '.pw', '.ws', '.club', '.icu', '.cam', '.rest', '.bar', '.wang'];
const TARGET_BRANDS = ['google', 'paypal', 'amazon', 'apple', 'microsoft', 'netflix', 'facebook', 'instagram', 'twitter', 'linkedin', 'chase', 'wellsfargo', 'bankofamerica', 'dhl', 'fedex', 'ups', 'usps', 'whatsapp', 'telegram', 'discord', 'steam', 'spotify', 'uber', 'dropbox', 'yahoo', 'ebay', 'walmart', 'coinbase', 'binance', 'metamask'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'account', 'update', 'confirm', 'bank', 'signin', 'password', 'credential', 'auth', 'billing', 'suspend', 'locked', 'expired', 'urgent', 'alert', 'validate', 'reactivate', 'restore', 'wallet', 'refund', 'invoice', 'payment'];

// ─── Levenshtein Distance ──────────────────────────────────────────────────────

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

// ─── Entropy Calculator ────────────────────────────────────────────────────────

function calculateEntropy(str) {
  const freq = {};
  for (const c of str) freq[c] = (freq[c] || 0) + 1;
  const len = str.length;
  let entropy = 0;
  for (const c in freq) {
    const p = freq[c] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

// ─── Heuristic Analysis (synchronous, fast) ────────────────────────────────────

function getHeuristicData(inputUrl) {
  let score = 0;
  const indicators = [];

  let urlObj;
  try {
    let urlToParse = inputUrl;
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://') && !inputUrl.startsWith('data:') && !inputUrl.startsWith('javascript:')) {
      urlToParse = 'http://' + inputUrl;
    }
    urlObj = new URL(urlToParse);
  } catch (e) {
    return {
      score: 100,
      verdict: 'Dangerous',
      indicators: [{ rule: 'Invalid URL', severity: 'critical', detail: 'The URL provided could not be parsed, which is highly suspicious.', points: 100 }],
      summary: 'This URL is malformed and could not be analyzed normally. Exercise extreme caution.',
      parseFailed: true
    };
  }

  const hostname = urlObj.hostname.toLowerCase();
  const pathAndQuery = (urlObj.pathname + urlObj.search).toLowerCase();
  const parts = hostname.split('.');
  const mainDomain = parts.length > 1 ? parts[parts.length - 2] : parts[0];

  // Rule 1: IP Address in URL
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    score += 15;
    indicators.push({ rule: 'IP Address', severity: 'high', detail: 'URL uses a direct IP address instead of a domain name', points: 15 });
  }

  // Rule 2: Suspicious TLD
  for (let tld of SUSPICIOUS_TLDS) {
    if (hostname.endsWith(tld)) {
      score += 10;
      indicators.push({ rule: 'Suspicious TLD', severity: 'high', detail: `Domain uses ${tld} — a TLD commonly abused for phishing`, points: 10 });
      break;
    }
  }

  // Rule 3: Typosquatting
  let isTyposquatting = false;
  if (mainDomain) {
    for (let brand of TARGET_BRANDS) {
      if (mainDomain !== brand && mainDomain.length >= 4) {
        let dist = levenshtein(mainDomain, brand);
        if ((brand.length < 6 && dist === 1) || (brand.length >= 6 && dist <= 2)) {
          score += 20;
          indicators.push({ rule: 'Typosquatting', severity: 'critical', detail: `Domain '${mainDomain}' is suspiciously similar to known brand '${brand}'`, points: 20 });
          isTyposquatting = true;
          break;
        }
      }
    }
  }

  // Rule 4: Brand name in subdomain (e.g., paypal.evil.com)
  if (!isTyposquatting && parts.length > 2) {
    for (let brand of TARGET_BRANDS) {
      for (let i = 0; i < parts.length - 2; i++) {
        if (parts[i].includes(brand)) {
          score += 15;
          indicators.push({ rule: 'Brand Impersonation', severity: 'critical', detail: `Subdomain contains brand name '${brand}' — likely an impersonation attempt`, points: 15 });
          break;
        }
      }
    }
  }

  // Rule 5: Excessive URL Length
  if (inputUrl.length > 150) {
    score += 8;
    indicators.push({ rule: 'Long URL', severity: 'medium', detail: 'URL is exceptionally long (>150 characters), often used to hide the true destination', points: 8 });
  } else if (inputUrl.length > 75) {
    score += 4;
    indicators.push({ rule: 'Long URL', severity: 'low', detail: 'URL is longer than average (>75 chars)', points: 4 });
  }

  // Rule 6: Suspicious Keywords
  let foundKeywords = [];
  for (let kw of SUSPICIOUS_KEYWORDS) {
    if (hostname.includes(kw) || pathAndQuery.includes(kw)) {
      foundKeywords.push(kw);
    }
  }
  if (foundKeywords.length > 0) {
    let pts = Math.min(foundKeywords.length * 5, 15);
    score += pts;
    indicators.push({ rule: 'Suspicious Keywords', severity: 'medium', detail: `URL contains deceptive keywords: ${foundKeywords.join(', ')}`, points: pts });
  }

  // Rule 7: @ Symbol in URL
  if (inputUrl.includes('@') && !inputUrl.startsWith('mailto:')) {
    score += 12;
    indicators.push({ rule: '@ Symbol Trick', severity: 'critical', detail: 'URL contains an @ symbol, which causes browsers to ignore everything before it (common redirect trick)', points: 12 });
  }

  // Rule 8: Multiple Subdomains
  if (parts.length > 3 && !/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    score += 8;
    indicators.push({ rule: 'Multiple Subdomains', severity: 'medium', detail: `URL has unusually deep subdomains (${parts.length - 2} levels)`, points: 8 });
  }

  // Rule 9: Hyphens in domain
  let hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    score += 10;
    indicators.push({ rule: 'Excessive Hyphens', severity: 'high', detail: 'Domain contains many hyphens — a strong indicator of a phishing domain', points: 10 });
  } else if (hyphenCount >= 2) {
    score += 6;
    indicators.push({ rule: 'Multiple Hyphens', severity: 'low', detail: 'Domain contains multiple hyphens, often used by attackers to create lookalike domains', points: 6 });
  }

  // Rule 10: No HTTPS
  if (urlObj.protocol === 'http:') {
    score += 5;
    indicators.push({ rule: 'No HTTPS', severity: 'low', detail: 'Connection is not encrypted (HTTP)', points: 5 });
  }

  // Rule 11: Non-standard port
  if (urlObj.port && urlObj.port !== '80' && urlObj.port !== '443') {
    score += 7;
    indicators.push({ rule: 'Non-Standard Port', severity: 'medium', detail: `URL specifies an unusual port number (:${urlObj.port})`, points: 7 });
  }

  // Rule 12: URL Shortener
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rb.gy', 'cutt.ly', 'shorturl.at'];
  if (shorteners.includes(hostname)) {
    score += 8;
    indicators.push({ rule: 'URL Shortener', severity: 'medium', detail: 'URL uses a shortener service which hides the final destination', points: 8 });
  }

  // Rule 13: Data / JS URI
  if (urlObj.protocol === 'data:' || urlObj.protocol === 'javascript:') {
    score += 15;
    indicators.push({ rule: 'Dangerous Scheme', severity: 'critical', detail: `URL uses '${urlObj.protocol}' scheme which can execute malicious code directly`, points: 15 });
  }

  // Rule 14: Punycode (IDN)
  if (hostname.includes('xn--')) {
    score += 12;
    indicators.push({ rule: 'Punycode Attack', severity: 'high', detail: 'Domain uses international characters (xn-- prefix), a technique used for visual spoofing', points: 12 });
  }

  // Rule 15: Double slashes in path
  if (urlObj.pathname.includes('//')) {
    score += 5;
    indicators.push({ rule: 'Path Redirect', severity: 'low', detail: 'Path contains double slashes (//), sometimes used for open redirects', points: 5 });
  }

  // Rule 16: Encoded chars
  let encodedCount = (inputUrl.match(/%[0-9a-f]{2}/gi) || []).length;
  if (encodedCount > 5) {
    score += 8;
    indicators.push({ rule: 'Heavy Encoding', severity: 'medium', detail: 'URL contains excessive character encoding, likely to obfuscate its true intent', points: 8 });
  }

  // Rule 17: High entropy domain (random-looking domain like "xkq8jf2m.com")
  if (mainDomain && mainDomain.length >= 6) {
    const entropy = calculateEntropy(mainDomain);
    if (entropy > 3.5) {
      score += 10;
      indicators.push({ rule: 'Random Domain', severity: 'high', detail: 'Domain appears to be randomly generated (high character entropy), a common trait of malicious domains', points: 10 });
    }
  }

  // Rule 18: Uncommon/Unknown TLD (not in the well-known list)
  const wellKnownTLDs = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.co', '.info', '.biz', '.me', '.us', '.uk', '.ca', '.au', '.de', '.fr', '.in', '.jp', '.app', '.dev'];
  const tld = '.' + parts[parts.length - 1];
  const isSuspiciousTLD = SUSPICIOUS_TLDS.some(s => hostname.endsWith(s));
  if (!wellKnownTLDs.includes(tld) && !isSuspiciousTLD && tld.length > 1) {
    score += 3;
    indicators.push({ rule: 'Uncommon TLD', severity: 'low', detail: `Domain uses an uncommon TLD (${tld}) which is less commonly associated with legitimate websites`, points: 3 });
  }

  // Finalize heuristic score
  score = Math.min(score, 100);

  let verdict = 'Safe';
  if (score > 70) verdict = 'Dangerous';
  else if (score > 45) verdict = 'Suspicious';
  else if (score > 20) verdict = 'Low Risk';

  let summary = `This URL appears mostly safe with a score of ${score}.`;
  if (score > 70) {
    summary = `This URL exhibits multiple high-risk indicators (${indicators.length} found). We strongly advise against visiting it.`;
  } else if (score > 45) {
    summary = `Proceed with caution. The engine flagged ${indicators.length} suspicious elements in this URL.`;
  } else if (score > 20) {
    summary = `This URL is slightly unusual but doesn't show strong signs of phishing.`;
  }

  if (isTyposquatting) {
    summary += " Note: It looks like it might be trying to impersonate a well-known brand.";
  }

  return {
    score,
    verdict,
    indicators,
    summary,
    // Extra metadata for the AI prompt
    hostname,
    mainDomain,
    tld,
    protocol: urlObj.protocol,
    pathAndQuery,
    subdomainCount: parts.length - 2,
    parseFailed: false
  };
}

// ─── AI Analysis via OpenRouter ────────────────────────────────────────────────

async function getAIAnalysis(inputUrl, heuristicResult) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    return null; // No key configured, skip AI
  }

  const systemPrompt = `You are an expert cybersecurity URL threat analyst. Your job is to analyze URLs and determine if they are phishing, scam, or malicious.

You will receive a URL along with technical heuristic signals already extracted from it. Your job is to:
1. Consider ALL the heuristic data provided.
2. Apply your own deep contextual analysis — think about the URL's structure, intent, plausibility, and whether a real human would be tricked by it.
3. Consider factors the heuristics CAN'T catch, like:
   - Whether the domain makes any semantic sense or is gibberish
   - Whether the path/query string looks like a credential harvesting page
   - Whether the overall URL structure mimics a known legitimate service
   - Whether the domain seems auto-generated, disposable, or throwaway
   - Context about common phishing campaign patterns
4. Produce a FINAL unified threat assessment.

IMPORTANT SCORING GUIDELINES:
- Score 0-20: Clearly legitimate, well-known domains, normal structure
- Score 21-45: Slightly unusual but probably benign  
- Score 46-70: Suspicious — multiple warning signs, proceed with caution
- Score 71-100: Dangerous — strong phishing/scam indicators, do NOT visit
- Random/gibberish domains that serve no legitimate purpose should score at LEAST 40-60
- Domains impersonating brands should score at LEAST 60-80
- Known safe domains (google.com, github.com, etc.) should score 0-5

You MUST respond with valid JSON only. No markdown, no explanation outside the JSON.

JSON schema:
{
  "score": <number 0-100>,
  "verdict": "<Safe | Low Risk | Suspicious | Dangerous>",
  "indicators": [
    {
      "rule": "<short rule name>",
      "severity": "<low | medium | high | critical>",
      "detail": "<human-readable explanation>",
      "points": <number>
    }
  ],
  "summary": "<2-3 sentence human-friendly summary explaining the threat assessment>"
}`;

  const userPrompt = `Analyze this URL for phishing/scam threats:

URL: ${inputUrl}

Technical heuristic signals already detected:
- Hostname: ${heuristicResult.hostname}
- Main domain: ${heuristicResult.mainDomain}
- TLD: ${heuristicResult.tld}
- Protocol: ${heuristicResult.protocol}
- Path: ${heuristicResult.pathAndQuery}
- Subdomain depth: ${heuristicResult.subdomainCount}
- Heuristic score: ${heuristicResult.score}/100
- Heuristic verdict: ${heuristicResult.verdict}
- Heuristic indicators: ${JSON.stringify(heuristicResult.indicators)}

Now provide your comprehensive AI threat assessment as JSON.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://phishguard.vercel.app',
        'X-Title': 'PhishGuard AI Scanner',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Low temperature for consistent, deterministic analysis
        max_tokens: 800,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenRouter AI Scanner error:', err);
      return null;
    }

    const data = await response.json();
    const replyContent = data.choices?.[0]?.message?.content;

    if (!replyContent) {
      console.error('AI Scanner: No content in response');
      return null;
    }

    // Parse the JSON response — handle potential markdown fencing
    let cleanedContent = replyContent.trim();
    // Strip markdown code fences if present
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    const aiResult = JSON.parse(cleanedContent);

    // Validate the response has required fields
    if (typeof aiResult.score !== 'number' || !aiResult.verdict || !Array.isArray(aiResult.indicators) || !aiResult.summary) {
      console.error('AI Scanner: Response missing required fields', aiResult);
      return null;
    }

    // Clamp score to valid range
    aiResult.score = Math.max(0, Math.min(100, Math.round(aiResult.score)));

    // Normalize verdict based on score to prevent mismatches
    if (aiResult.score > 70) aiResult.verdict = 'Dangerous';
    else if (aiResult.score > 45) aiResult.verdict = 'Suspicious';
    else if (aiResult.score > 20) aiResult.verdict = 'Low Risk';
    else aiResult.verdict = 'Safe';

    // Ensure each indicator has required fields
    aiResult.indicators = aiResult.indicators.map(ind => ({
      rule: ind.rule || 'Unknown',
      severity: ['low', 'medium', 'high', 'critical'].includes(ind.severity) ? ind.severity : 'medium',
      detail: ind.detail || 'No details provided',
      points: typeof ind.points === 'number' ? ind.points : 0
    }));

    return aiResult;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('AI Scanner: Request timed out after 15s');
    } else if (err instanceof SyntaxError) {
      console.error('AI Scanner: Failed to parse AI response as JSON');
    } else {
      console.error('AI Scanner error:', err.message);
    }
    return null;
  }
}

// ─── Main Export: Async AI-Powered Analysis ────────────────────────────────────

export async function analyzeUrl(inputUrl) {
  // Step 1: Run fast heuristic analysis
  const heuristicResult = getHeuristicData(inputUrl);

  // If URL couldn't even be parsed, return immediately — no AI needed
  if (heuristicResult.parseFailed) {
    return {
      score: heuristicResult.score,
      verdict: heuristicResult.verdict,
      indicators: heuristicResult.indicators,
      summary: heuristicResult.summary
    };
  }

  // Step 2: Try AI analysis
  const aiResult = await getAIAnalysis(inputUrl, heuristicResult);

  // Step 3: If AI succeeded, use its result (it already has heuristic context baked in)
  if (aiResult) {
    return {
      score: aiResult.score,
      verdict: aiResult.verdict,
      indicators: aiResult.indicators,
      summary: aiResult.summary
    };
  }

  // Step 4: Fallback to heuristic-only result if AI failed
  console.log('AI Scanner unavailable — falling back to heuristic engine');
  return {
    score: heuristicResult.score,
    verdict: heuristicResult.verdict,
    indicators: heuristicResult.indicators,
    summary: heuristicResult.summary
  };
}
