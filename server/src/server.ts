import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (Local Compass or Atlas)
connectDB();

// CORS Configuration strictly matching user specifications + local development
const allowedOrigins = [
  'https://balaji-tent-house.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy violation'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing & Cookie Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'BALAJI TENT HOUSE API Server',
    location: 'Bijoliya, Bhilwara',
    owner: 'Yamuna Shankar Bairagi',
    database: 'Connected to MongoDB Compass (balaji-tent-house)',
  });
});

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('BALAJI TENT HOUSE API is running securely.');
});

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error Handler]:', err);
  const statusCode = err.status || (err.message === 'CORS policy violation' ? 403 : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` BALAJI TENT HOUSE API SERVER ONLINE     `);
  console.log(` Port: ${PORT}                           `);
  console.log(` Database: MongoDB Compass               `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
