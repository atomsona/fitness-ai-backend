import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import passport from './config/passport.js';

import authRoutes from './routes/auth.js';
import questRoutes from './routes/quests.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// CRITICAL: Handle preflight requests FIRST
app.options('*', cors({
  origin: [
    'http://localhost:5173',
    'https://fitness-ai-frontend-zhzx.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://fitness-ai-frontend-zhzx.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World',
    server: 'Fitness AI Backend',
    status: 'Running'
  });
});


app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    requestedPath: req.path
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


connectDB();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    
  });
}

export default app;