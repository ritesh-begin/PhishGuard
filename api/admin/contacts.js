import dbConnect from '../lib/mongodb.js';
import { Contact } from '../lib/models.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  // Check auth first
  const authError = requireAdmin(req, res, null);
  if (authError !== true) return; // if it returned a response, stop

  if (req.method === 'GET') {
    try {
      await dbConnect();
      const contacts = await Contact.find().sort({ createdAt: -1 });
      return res.status(200).json(contacts);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  } 
  
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await dbConnect();
      await Contact.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to delete' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
