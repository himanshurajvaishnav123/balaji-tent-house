# BALAJI TENT HOUSE - Full-Stack MERN Application

A production-ready, animated web application with an Admin Control Panel built for **BALAJI TENT HOUSE** (Owner: Yamuna Shankar Bairagi, Bijoliya, Bhilwara).

---

## 🏛️ Business Profile
- **Business Name**: BALAJI TENT HOUSE
- **Proprietor**: Yamuna Shankar Bairagi
- **Phone**: +919783950350
- **Location**: Malka khera, sarkari samiti ke samne, bijoliya, Bhilwara (Rajasthan)
- **Specialties**:
  1. Grand Tent Setup & Royal Wedding Decor (Mandap, Shamiana, Stage, Floral, Lighting)
  2. Waterproof / Monsoon Tents (Barsat ke German Hangar & Tarpaulin)
  3. Commercial Cooking Utensils & Halwai Equipment Rental (Bhagone, Kadai, Parat, Bhati, Chamach, Water Drums)

---

## 📁 Subfolder Architecture

```
/balaji-tent-house
├── /client                # React 18 + TypeScript + Vite + Tailwind CSS SPA (Target: Vercel)
│   ├── vercel.json        # SPA rewrite rules to prevent 404 on refresh
│   ├── src/
│   │   ├── api/client.ts  # Hardcoded Render production API baseURL
│   │   ├── components/    # Navbar, Hero, OwnerShowcase, Services, Utensils, Gallery, Booking, etc.
│   │   ├── context/       # AuthContext, SettingsContext (with offline fallbacks)
│   │   ├── pages/         # HomePage, AdminLoginPage, AdminDashboardPage
│   │   └── types/         # TypeScript interfaces
│   └── dist/              # Production build output
└── /server                # Express + Node.js + Mongoose TypeScript API (Target: Render)
    ├── .env               # Database URI & JWT secrets
    └── src/
        ├── config/db.ts   # MongoDB Atlas connection
        ├── models/        # User, SiteSettings, GalleryItem, Service, Enquiry
        ├── middleware/    # requireAdmin JWT cookie & header verification
        ├── controllers/   # auth, settings, gallery, service, enquiry controllers
        ├── routes/        # Modular Express routers
        ├── scripts/seed.ts# Admin & initial database seeding script
        └── server.ts      # Main Express server with strict CORS rules
```

---

## 🔐 Admin Credentials (Default)
- **Portal URL**: `/admin/login`
- **Email**: `himansu@gmail.com`
- **Password**: `123456789`
- *Note: You can update credentials directly from the Admin Dashboard > Security tab.*

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Seeding
```bash
cd server
npm install
npm run seed:admin   # Seeds admin user, site settings, services & gallery
npm run dev          # Runs on http://localhost:5000
```

### 2. Frontend Setup & Build
```bash
cd client
npm install
npm run dev          # Runs on http://localhost:5173
npm run build        # Production build to /client/dist
```

---

## 🌐 Production Deployment

### Backend (Render)
1. Deploy the `/server` directory as a **Web Service** on Render.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start`
4. Set Environment Variables from `.env` in the Render dashboard.

### Frontend (Vercel)
1. Deploy the `/client` directory as a project on Vercel.
2. Framework Preset: `Vite`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. `vercel.json` handles client-side routing rewrites automatically.
