import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import questRoutes from './routes/quests.js';
import adminRoutes from './routes/admin.js';
import serverless from 'serverless-http';

dotenv.config();
const app = express();



// Required for Vercel preflight
app.options(
  '*',
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Body + cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/admin', adminRoutes);

// Root test
app.get('/', (req, res) => {
  res.json({ message: 'Fitness AI Backend Running' });
});

// Connect database ONCE (not per request)
await connectDB();

// Export serverless handler for Vercel
export const handler = serverless(app);
