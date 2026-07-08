import loginHandler from '../backend/auth/login.js';
import adminContactsHandler from '../backend/admin/contacts.js';
import adminSubscribersHandler from '../backend/admin/subscribers.js';
import adminScansHandler from '../backend/admin/scans.js';
import scanIdHandler from '../backend/scan/[id].js';
import aiChatHandler from '../backend/ai/chat.js';
import contactHandler from '../backend/contact.js';
import scanHandler from '../backend/scan.js';
import statsHandler from '../backend/stats.js';
import scansHandler from '../backend/scans.js';
import newsletterHandler from '../backend/newsletter.js';

export default async function handler(req, res) {
  try {
    // Determine the original path
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Optional: Parse query if Vercel doesn't pre-populate it perfectly
    if (!req.query) {
      req.query = Object.fromEntries(url.searchParams);
    }

    // Static Routing
    if (pathname === '/api/auth/login') return loginHandler(req, res);
    if (pathname === '/api/admin/contacts') return adminContactsHandler(req, res);
    if (pathname === '/api/admin/subscribers') return adminSubscribersHandler(req, res);
    if (pathname === '/api/admin/scans') return adminScansHandler(req, res);
    
    // Dynamic Routing for /api/scan/[id]
    if (pathname.startsWith('/api/scan/') && pathname.split('/').length === 4) {
      const id = pathname.split('/')[3];
      req.query = { ...req.query, id }; // Inject id into req.query
      return scanIdHandler(req, res);
    }

    if (pathname === '/api/ai/chat') return aiChatHandler(req, res);
    if (pathname === '/api/contact') return contactHandler(req, res);
    if (pathname === '/api/scan') return scanHandler(req, res);
    if (pathname === '/api/stats') return statsHandler(req, res);
    if (pathname === '/api/scans') return scansHandler(req, res);
    if (pathname === '/api/newsletter') return newsletterHandler(req, res);

    // If no route matched
    res.status(404).json({ error: 'API Endpoint Not Found' });
  } catch (error) {
    console.error('Master API Router Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
