import mongoose from 'mongoose';

const ScanSchema = new mongoose.Schema({
  url: { type: String, required: true },
  score: { type: Number, required: true },
  verdict: { type: String, required: true },
  indicators: [{
    rule: String,
    severity: String,
    detail: String,
    points: Number
  }],
  summary: String,
  ipAddress: String,
  sessionId: { type: String, index: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: String,
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

const AdminUserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

// Prevent OverwriteModelError in serverless env
export const Scan = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
