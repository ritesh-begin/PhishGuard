import dbConnect from '../lib/mongodb.js';
import { Scan } from '../lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Fallback to req.params.id for local Express mock
  const id = req.query.id || (req.params && req.params.id);
  const sessionId = req.query.sessionId;

  try {
    await dbConnect();
    
    if (req.method === 'GET') {
      const scan = await Scan.findById(id).select('-ipAddress -__v');
      if (!scan) return res.status(404).json({ error: 'Scan not found' });
      return res.status(200).json(scan);
    }
    
    if (req.method === 'DELETE') {
      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID required for deletion' });
      }
      
      const scan = await Scan.findById(id);
      if (!scan) return res.status(404).json({ error: 'Scan not found' });
      
      if (scan.sessionId !== sessionId) {
        return res.status(403).json({ error: 'Unauthorized to delete this scan' });
      }
      
      await Scan.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
