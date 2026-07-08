import dbConnect from './_lib/mongodb.js';
import { Contact } from './_lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await dbConnect();
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    
    // just send a success message back
    res.status(200).json({ message: 'Message received. We will get back to you soon.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
}
