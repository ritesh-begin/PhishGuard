import dbConnect from '../lib/mongodb.js';
import { Scan } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  const authError = requireAdmin(req, res, null);
  if (authError !== true) return;

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await dbConnect();
    // Admin gets full data including IP addresses
    const scans = await Scan.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(scans);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
}
