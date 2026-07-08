import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { AdminUser } from './models.js';

// load env for standalone script execution
dotenv.config({ path: '.env.local' });
dotenv.config();

const uri = process.env.MONGODB_URI;

async function seed() {
  if (!uri) {
    console.error('No MONGODB_URI found.');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Check if exists
    const existing = await AdminUser.findOne({ username });
    if (existing) {
      console.log('Admin user already exists.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const admin = new AdminUser({ username, passwordHash });
      await admin.save();
      console.log(`Created admin user: ${username}`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

seed();
