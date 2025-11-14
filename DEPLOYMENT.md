# 🚀 Vercel Deployment Guide

## Important Note About Backend

**⚠️ Current Limitation:** This project uses SQLite which is a file-based database. Vercel's serverless architecture doesn't support file-based databases because each function runs in an isolated environment.

## Deployment Options

### Option 1: Frontend Only (Recommended for Demo)
Deploy just the frontend to Vercel and keep the backend running locally or on another platform.

### Option 2: Full Stack with Cloud Database
Migrate from SQLite to a cloud database like:
- **Vercel Postgres** (recommended)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **MongoDB Atlas**

---

## 🎯 Quick Deploy - Frontend Only

### Step 1: Update Frontend API URL

Before deploying, you need to have your backend hosted somewhere. Options:
- **Render.com** (free tier available)
- **Railway.app** (free tier)
- **Heroku** (paid)
- **Your local machine** (for testing only)

### Step 2: Set Environment Variable

In `frontend/.env`:
```env
VITE_API_URL=https://your-backend-url.com
```

### Step 3: Deploy to Vercel

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add `VITE_API_URL` with your backend URL

---

## 🔧 Full Stack Deployment (Advanced)

If you want to deploy everything to Vercel, you'll need to:

### 1. Migrate to Vercel Postgres

```bash
# Install Vercel Postgres
npm install @vercel/postgres
```

### 2. Update database configuration

Replace `backend/src/config/database.js` to use Postgres instead of SQLite.

### 3. Update vercel.json for API routes

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

## 🎨 Current Vercel Configuration

The project is configured to deploy the **frontend only** with these settings:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite"
}
```

---

## 📝 Environment Variables Needed

### Frontend (Vercel):
- `VITE_API_URL` - Your backend API URL

### Backend (Separate hosting):
- `GEMINI_API_KEY` - Your Google Gemini API key
- `PEXELS_API_KEY` - Your Pexels API key  
- `PORT` - Server port (usually 5000)
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your Vercel frontend URL for CORS

---

## 🌐 Recommended Architecture

```
┌─────────────────────┐
│   Vercel (Frontend) │
│   React + Vite      │
└──────────┬──────────┘
           │
           │ HTTP Requests
           │
           ▼
┌─────────────────────┐
│  Render.com/Railway │
│  (Backend API)      │
│  Node.js + Express  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  SQLite Database    │
│  (Persistent Disk)  │
└─────────────────────┘
```

---

## 🚀 Deploy Backend to Render.com (Free)

1. **Create account** at render.com
2. **New Web Service** → Connect GitHub repo
3. **Build Command**: `cd backend && npm install`
4. **Start Command**: `cd backend && node src/server.js`
5. **Add Environment Variables**:
   - `GEMINI_API_KEY`
   - `PEXELS_API_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
6. **Add Persistent Disk** for database.db at `/opt/render/project/src/backend`

---

## ✅ Final Deployment Steps

1. **Deploy Backend** to Render.com/Railway
2. **Get Backend URL** (e.g., https://your-app.onrender.com)
3. **Update Frontend** `.env` with backend URL
4. **Deploy Frontend** to Vercel:
   ```bash
   vercel --prod
   ```
5. **Test the app** at your Vercel URL

---

## 🔍 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` is set in backend environment variables
- Check that frontend is using correct `VITE_API_URL`

### API Not Found
- Verify backend is running and accessible
- Check backend logs for errors
- Test backend health endpoint: `https://your-backend-url.com/health`

### Images Not Loading
- Ensure Pexels API key is set in backend
- Check image URLs are accessible
- Verify CORS headers allow image loading

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render.com Documentation](https://render.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

Need help? Check the main README.md for more information.
