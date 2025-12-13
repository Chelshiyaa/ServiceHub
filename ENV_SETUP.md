# Environment Variables Setup Guide

## Quick Reference

### For Render (Backend) - Set these in Render Dashboard:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-app.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@servicehub.com
ADMIN_PASSWORD=Admin@123
```

**Optional:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### For Vercel (Frontend) - Set this in Vercel Dashboard:

```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

**Important Notes:**
- Replace `your-backend-app.onrender.com` with your actual Render backend URL
- Make sure to include `/api` at the end
- Replace `your-frontend-app.vercel.app` with your actual Vercel frontend URL
- No trailing slashes in URLs

---

## Step-by-Step Setup

### 1. Deploy Backend to Render First

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
5. Add all environment variables listed above
6. Deploy and copy your backend URL (e.g., `https://servicehub-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repo
3. Set:
   - **Root Directory**: `client`
   - **Framework**: Vite
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-app.onrender.com/api`
5. Deploy and copy your frontend URL (e.g., `https://servicehub.vercel.app`)

### 3. Update Backend CLIENT_URL

1. Go back to Render
2. Update `CLIENT_URL` environment variable with your Vercel URL
3. Service will auto-restart

### 4. Test

1. Visit your Vercel URL
2. Try registering/login
3. Check browser console for errors
4. Check Network tab to verify API calls

---

## Local Development Setup

### Backend `.env` (in `server/` folder):
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=local-dev-secret-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@servicehub.com
ADMIN_PASSWORD=Admin@123
```

### Frontend `.env` (in `client/` folder):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Troubleshooting

### CORS Errors
- Verify `CLIENT_URL` in Render matches your Vercel URL exactly
- No trailing slashes
- Include `https://` protocol

### API Not Connecting
- Verify `VITE_API_URL` includes `/api` at the end
- Check Render service is running
- Test: `https://your-backend.onrender.com/api/health`

### Environment Variables Not Working
- **Vercel**: Variables must start with `VITE_` for client access
- **Render**: Restart service after adding variables
- Check for typos and extra spaces
