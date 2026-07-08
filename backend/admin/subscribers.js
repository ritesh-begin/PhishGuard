import dbConnect from '../lib/mongodb.js';
import { Subscriber } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  const authError = requireAdmin(req, res, null);
  if (authError !== true) return;

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await dbConnect();
    const subs = await Subscriber.find().sort({ subscribedAt: -1 });
    res.status(200).json(subs);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
}
