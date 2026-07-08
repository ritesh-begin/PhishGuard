import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mocking Vercel serverless functions by wrapping them in Express route handlers
const wrapHandler = (handler) => async (req, res) => {
  try {
    // Some basic mapping of Express req/res to Vercel-like req/res if needed
    // In most simple cases, Express req/res works fine for Vercel functions
    await handler(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Import handlers
import scanHandler from './api/scan.js';
import scansHandler from './api/scans.js';
import scanIdHandler from './api/scan/[id].js';
import statsHandler from './api/stats.js';
import contactHandler from './api/contact.js';
import newsletterHandler from './api/newsletter.js';
import loginHandler from './api/auth/login.js';
import adminContactsHandler from './api/admin/contacts.js';
import adminScansHandler from './api/admin/scans.js';
import adminSubsHandler from './api/admin/subscribers.js';
import aiChatHandler from './api/ai/chat.js';

// Mount routes
app.all('/api/scan', wrapHandler(scanHandler));
app.all('/api/scans', wrapHandler(scansHandler));
app.all('/api/scan/:id', (req, res) => {
  return wrapHandler(scanIdHandler)(req, res);
});
app.all('/api/stats', wrapHandler(statsHandler));
app.all('/api/contact', wrapHandler(contactHandler));
app.all('/api/newsletter', wrapHandler(newsletterHandler));
app.all('/api/auth/login', wrapHandler(loginHandler));
app.all('/api/admin/contacts', wrapHandler(adminContactsHandler));
app.all('/api/admin/scans', wrapHandler(adminScansHandler));
app.all('/api/admin/subscribers', wrapHandler(adminSubsHandler));
app.all('/api/ai/chat', wrapHandler(aiChatHandler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local dev server running on http://localhost:${PORT}`);
});
