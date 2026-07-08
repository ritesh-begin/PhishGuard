import dbConnect from './_lib/mongodb.js';
import { Scan } from './_lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = req.query.sessionId;

  try {
    await dbConnect();
    
    const query = sessionId ? { sessionId } : {};
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required for personal stats' });
    }

    const totalScans = await Scan.countDocuments(query);
    const threatsFound = await Scan.countDocuments({ ...query, verdict: { $in: ['Suspicious', 'Dangerous'] } });
    const safeCount = await Scan.countDocuments({ ...query, verdict: 'Safe' });
    
    // Calculate average score roughly
    const result = await Scan.aggregate([
      { $match: query },
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);
    
    const avgScore = result.length > 0 ? Math.round(result[0].avgScore) : 0;

    res.status(200).json({
      totalScans,
      threatsFound,
      safeCount,
      avgScore
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching stats' });
  }
}
