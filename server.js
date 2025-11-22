import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

import authRoutes from './routes/auth.js';
import questRoutes from './routes/quests.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://fitness-ai-frontend-zhzx.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

// CORS - must come before routes
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// Handle preflight requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to DB (with cache for serverless)
let cachedDb = null;
const initDB = async () => {
  if (cachedDb) return cachedDb;
  cachedDb = await connectDB();
  return cachedDb;
};
initDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World',
    server: 'Fitness AI Backend',
    status: 'Running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ✅ LOCAL DEVELOPMENT
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// ✅ For Vercel Serverless, just export app
export default app;
