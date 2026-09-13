# BALAJI TENT HOUSE — Full-Stack Website + Admin Panel

MERN stack (MongoDB, Express, React, Node) website and secure admin panel for
BALAJI TENT HOUSE, a tent decoration and catering utensil rental business in
Bijoliya, Bhilwara.

## Structure

```
balaji-tent-house/
├── server/     # Express + TypeScript + MongoDB (Mongoose) API
└── client/     # React + Vite + TypeScript + Tailwind + Framer Motion
```

## 1. Backend setup (`/server`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credentials for the first admin account
- SMTP settings — for email enquiry notifications (Gmail App Password works well)
- Optional: Twilio settings if you want SMS alerts (`npm install twilio` first, then set `TWILIO_ENABLED=true`)

Create the first admin user and default site settings:
```bash
npm run seed:admin
```

Run the API in development:
```bash
npm run dev
```
The API runs at `http://localhost:5000/api` (health check: `GET /api/health`).

Build for production:
```bash
npm run build
npm start
```

### API overview

| Method | Route | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login, sets HttpOnly cookie + returns JWT |
| POST | `/api/auth/logout` | Admin | Clear session |
| GET | `/api/auth/me` | Admin | Get current admin profile |
| PUT | `/api/auth/profile` | Admin | Update name/email/phone |
| PUT | `/api/auth/change-password` | Admin | Change password |
| GET | `/api/gallery` | Public | List past work |
| POST/PUT/DELETE | `/api/gallery` | Admin | Manage past work (CRUD) |
| POST | `/api/enquiries` | Public | Submit booking enquiry (triggers email/SMS alert) |
| GET/PUT/DELETE | `/api/enquiries` | Admin | Manage enquiries |
| GET | `/api/settings` | Public | Fetch owner/business info shown on site |
| PUT | `/api/settings` | Admin | Update owner/business info |
| POST | `/api/upload/image` | Admin | Upload a photo (gallery, owner photo, or logo) from disk/device, returns its URL |

## 2. Frontend setup (`/client`)

```bash
cd client
npm install
cp .env.example .env
```

Set `VITE_API_URL` to your backend's `/api` URL.

```bash
npm run dev
```
Runs at `http://localhost:5173`.

Build for production:
```bash
npm run build
```
Outputs static files to `client/dist`, deployable to Vercel, Netlify, or any static host.

## 3. Security notes

- Passwords are hashed with bcrypt (12 salt rounds).
- Admin sessions use an HttpOnly, SameSite cookie holding a signed JWT; a bearer token is also issued for clients where third-party cookies are restricted.
- Login and public enquiry endpoints are rate-limited.
- `helmet` sets standard security headers; CORS is locked to `CLIENT_URL`.
- Set `NODE_ENV=production` in production so cookies are sent with `Secure` + `SameSite=None` (required if frontend and backend are on different domains — both must then be served over HTTPS).

## 4. First login

1. Run `npm run seed:admin` in `/server` with your chosen `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`.
2. Visit `/admin/login` on the deployed frontend and sign in (there's also a small "Admin Login" link at the very bottom of the public site footer).
3. From the dashboard's **Site Settings** tab, upload the business logo and owner photo directly from your phone or computer (or paste an image link instead), choose how the logo should display (circle / square / rectangle), and set phone, WhatsApp number, and address — these populate the header, hero, footer, and floating WhatsApp/call buttons across the public site immediately.
4. Add real project photos under **Gallery** — each entry supports uploading a photo from your device's gallery or pasting a link.
5. Under the **Account** tab, the admin can update their login name/email and change their password at any time.
6. Incoming enquiries from the public site's booking form appear under **Enquiries**, with an email (and optional SMS) sent to the owner automatically.

## 5. Image uploads

Uploaded photos (gallery, owner photo, logo) are stored on the server's disk at `server/uploads/` and served at `<API_URL>/uploads/<filename>`. This works well for a single-server deployment. If you later move to a host with an ephemeral filesystem (e.g. some serverless/container platforms wipe local disk on redeploy), swap the storage in `server/src/middleware/upload.ts` for a cloud provider (Cloudinary, S3, etc.) — the rest of the app only cares about the final image URL, so no other code needs to change.

## 6. Deployment suggestions

- **Backend:** Render, Railway, or a small VPS running Node behind Nginx.
- **Database:** MongoDB Atlas free tier is sufficient to start.
- **Frontend:** Vercel or Netlify, pointed at `VITE_API_URL`.
- Use custom domains for both and update `CLIENT_URL` (server) and `VITE_API_URL` (client) accordingly.
