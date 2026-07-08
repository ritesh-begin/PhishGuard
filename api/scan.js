import dbConnect from './_lib/mongodb.js';
import { Scan } from './_lib/models.js';
import { analyzeUrl } from './_lib/phishingEngine.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url, sessionId } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL' });
  }

  try {
    await dbConnect();
    
    // Get client IP for rate limiting/logging
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    // Run the engine
    const result = await analyzeUrl(url);

    // Save to DB
    const scan = new Scan({
      url,
      score: result.score,
      verdict: result.verdict,
      indicators: result.indicators,
      summary: result.summary,
      ipAddress,
      sessionId
    });
    
    await scan.save();

    res.status(200).json({
      id: scan._id,
      url: scan.url,
      score: scan.score,
      verdict: scan.verdict,
      indicators: scan.indicators,
      summary: scan.summary,
      scannedAt: scan.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
