import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import questRoutes from './routes/quests.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();

// CORS
console.log(process.env.CLIENT_URL, "client URL")
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));

// Body & cookie
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/admin', adminRoutes);

// Root
app.get('/', (req, res) => res.json({ message: 'Fitness AI Backend Running' }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found', path: req.path }));

// Error handler
app.use((err, req, res, next) => res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' }));

connectDB().then((res) => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

})
// Local dev

