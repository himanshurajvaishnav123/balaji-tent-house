import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { SiteSettings } from './models/SiteSettings.js';
import { Service } from './models/Service.js';
import { GalleryItem } from './models/GalleryItem.js';

import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-seed bootstrap function for zero-configuration deployment on Render
const autoBootstrap = async () => {
  try {
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const adminEmail = (process.env.ADMIN_EMAIL || 'himansu@gmail.com').toLowerCase().trim();
      const adminPassword = process.env.ADMIN_PASSWORD || '123456789';
      const adminName = process.env.ADMIN_NAME || 'Yamuna Shankar Bairagi';
      const adminPhone = process.env.ADMIN_NUMBER || process.env.ADMIN_PHONE || '+919783950350';

      const admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: 'admin',
      });
      await admin.save();
      console.log(`[Bootstrap]: Created initial Admin account (${adminEmail})`);
    }

    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      const adminName = process.env.ADMIN_NAME || 'Yamuna Shankar Bairagi';
      const adminPhone = process.env.ADMIN_NUMBER || process.env.ADMIN_PHONE || '+919783950350';
      const adminEmail = (process.env.ADMIN_EMAIL || 'himansu@gmail.com').toLowerCase().trim();

      await SiteSettings.create({
        businessName: 'BALAJI TENT HOUSE',
        ownerName: adminName,
        phone: adminPhone,
        email: adminEmail,
        address: 'Malka khera, sarkari samiti ke samne, bijoliya, Bhilwara',
        ownerPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        logoUrl: '',
        heroTitle: 'Grand Tent Setup, Royal Weddings & Catering Equipment',
        heroSubtitle: 'Your most trusted event partner in Bijoliya & Bhilwara region. Specialized in Royal Mandap, Waterproof Monsoon Tents & Full Cooking Utensils Rental.',
        heroBannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
        aboutText: 'Welcome to Balaji Tent House, led by Yamuna Shankar Bairagi. With over 15+ years of dedicated service across Bijoliya and the greater Bhilwara district, we deliver majestic shamianas, waterproof pavilions for monsoon events, luxury lighting, and complete sets of traditional cooking equipment and catering utensils for all your celebratory needs.',
      });
      console.log('[Bootstrap]: Initialized default SiteSettings');
    }

    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      await Service.insertMany([
        {
          title: 'Royal Wedding & Event Tent Setup',
          description: 'Luxurious shamianas, grand entry gates, thematic wedding mandaps, banquet carpets, VIP sofas, and high-intensity decorative lighting for weddings and corporate gatherings.',
          iconName: 'Tent',
          imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'Custom Wedding Packages',
          isAvailable: true,
        },
        {
          title: 'Waterproof / Monsoon Tents (Barsat ke Tent)',
          description: 'Specialized 100% leak-proof German waterproof tents and heavy-duty tarpaulins designed specifically for monsoon weddings, religious katha, and outdoor festivities.',
          iconName: 'ShieldCheck',
          imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'All-Weather Guaranteed',
          isAvailable: true,
        },
        {
          title: 'Cooking Utensils & Catering Equipment Rental',
          description: 'Complete Halwai & catering set: Big Bhagone, Kadai, Parat, Bhati, Chamach, Gas Bhatti, Chulha, stainless steel dinner sets, water drums, and hot-pots for gatherings of 100 to 5,000+ guests.',
          iconName: 'UtensilsCrossed',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'Flexible Daily / Event Rates',
          isAvailable: true,
        },
        {
          title: 'Lighting, Sound & Stage Decor',
          description: 'Halogen, LED par cans, fairy serial lights, dynamic focus lights, audio amplifiers, and designer floral backdrops for sangeet and reception nights.',
          iconName: 'Sparkles',
          imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop',
          priceTag: 'Stage & Ambience Packages',
          isAvailable: true,
        },
      ]);
      console.log('[Bootstrap]: Initialized default services');
    }

    const galleryCount = await GalleryItem.countDocuments();
    if (galleryCount === 0) {
      await GalleryItem.insertMany([
        {
          title: 'Grand Royal Mandap & Reception Pavilion',
          description: 'Spectacular maroon & gold thematic tent setup with crystal chandeliers and floral arches for a royal wedding celebration.',
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
          location: 'Bijoliya Royal Palace Grounds',
          category: 'Tent Decoration',
        },
        {
          title: 'All-Weather Monsoon Waterproof Tent',
          description: 'Complete waterproof shelter built to withstand heavy summer rains, keeping 1,200 guests completely dry and comfortable.',
          imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop',
          location: 'Malka Khera Main Ground, Bijoliya',
          category: 'Waterproof Tents',
        },
        {
          title: 'Complete Traditional Halwai Utensil Setup',
          description: 'Giant copper & stainless steel Bhagone, Kadai, Bhati, and serving spoons deployed for a 2,000 person community feast (Prasadi).',
          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
          location: 'Bhilwara Road, Bijoliya',
          category: 'Utensils Rental',
        },
      ]);
      console.log('[Bootstrap]: Initialized default gallery items');
    }
  } catch (err: any) {
    console.warn('[Bootstrap Warning]: Auto-bootstrap check encountered an issue:', err.message);
  }
};

// Connect to Database and run bootstrap
connectDB().then(() => {
  autoBootstrap();
});

// Dynamic CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

if (process.env.FRONTEND_URL) {
  const frontends = process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/$/, ''));
  allowedOrigins.push(...frontends);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy violation: ${origin} not allowed.`), false);
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
    environment: process.env.NODE_ENV || 'production',
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
  const statusCode = err.status || (err.message?.includes('CORS policy violation') ? 403 : 500);
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
  console.log(` Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(` FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not specified (allowing *.vercel.app)'}`);
  console.log(`=========================================`);
});
