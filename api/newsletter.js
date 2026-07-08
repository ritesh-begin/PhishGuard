import dbConnect from './_lib/mongodb.js';
import { Subscriber } from './_lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await dbConnect();
    
    // check if exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed!' });
    }

    const sub = new Subscriber({ email });
    await sub.save();
    
    res.status(200).json({ message: 'Thanks for subscribing!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
}
