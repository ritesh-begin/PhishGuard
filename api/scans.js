import dbConnect from './lib/mongodb.js';
import { Scan } from './lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sessionId = req.query.sessionId;
    const skip = (page - 1) * limit;

    const query = sessionId ? { sessionId } : {}; // if no sessionId passed, arguably we return nothing, but let's keep it safe. Actually, privacy requires sessionId.
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required for history' });
    }

    const scans = await Scan.find(query)
      .select('-ipAddress -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Scan.countDocuments(query);

    res.status(200).json({
      data: scans,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
