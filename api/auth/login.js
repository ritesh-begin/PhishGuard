import dbConnect from '../_lib/mongodb.js';
import { AdminUser } from '../_lib/models.js';
import { signToken } from '../_lib/auth.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { username, password } = req.body;

  try {
    await dbConnect();
    
    const user = await AdminUser.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: user._id, username: user.username });
    
    res.status(200).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
}
