# Deployment Configuration Changes

This document summarizes all changes made to prepare the application for deployment to Vercel (Frontend) and Render (Backend).

## Files Modified

### 1. `client/src/utils/axios.js`
**Changes:**
- Updated to use `VITE_API_URL` environment variable
- Added fallback to `http://localhost:5000/api` for local development
- Added helpful comments explaining environment variable usage

**Before:**
```javascript
baseURL: import.meta.env.VITE_API_URL,  // Hardcoded comment
```

**After:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
baseURL: API_URL,
```

### 2. `server/server.js`
**Changes:**
- Already configured to use `CLIENT_URL` environment variable
- Added additional localhost port (5174) for development
- CORS configuration already uses environment variables correctly

**Status:** ✅ Already properly configured

## Files Created

### 1. `DEPLOYMENT.md`
Complete deployment guide with:
- Step-by-step instructions for Render (Backend)
- Step-by-step instructions for Vercel (Frontend)
- Environment variables setup
- Troubleshooting guide
- Post-deployment configuration steps

### 2. `ENV_SETUP.md`
Quick reference guide for:
- Environment variables needed for both platforms
- Local development setup
- Common troubleshooting issues

### 3. `render.yaml`
Render blueprint configuration file (optional but helpful)

### 4. `vercel.json`
Vercel configuration file for:
- Build settings
- Output directory
- Framework detection
- SPA routing configuration

### 5. `.gitignore` (Updated)
Enhanced to properly ignore:
- All `.env` files in both client and server directories
- Node modules
- Build outputs
- Log files
- IDE files

## Environment Variables Required

### Render (Backend) - Required:
- `NODE_ENV=production`
- `PORT=5000`
- `CLIENT_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secure random string for JWT signing
- `JWT_EXPIRE=7d`
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

### Render (Backend) - Optional:
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - For password reset
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - For image uploads

### Vercel (Frontend) - Required:
- `VITE_API_URL` - Your Render backend URL + `/api` (e.g., `https://your-backend.onrender.com/api`)

## Deployment Checklist

### Before Deployment:
- [ ] MongoDB Atlas database created and connection string ready
- [ ] Cloudinary account set up (if using image uploads)
- [ ] Email service configured (if using password reset)
- [ ] Strong JWT_SECRET generated
- [ ] Admin credentials decided

### Render (Backend) Deployment:
- [ ] Create new Web Service in Render
- [ ] Connect GitHub repository
- [ ] Set build command: `cd server && npm install`
- [ ] Set start command: `cd server && npm start`
- [ ] Add all required environment variables
- [ ] Deploy and copy backend URL

### Vercel (Frontend) Deployment:
- [ ] Import GitHub repository
- [ ] Set root directory to `client`
- [ ] Set framework to Vite
- [ ] Add `VITE_API_URL` environment variable
- [ ] Deploy and copy frontend URL

### Post-Deployment:
- [ ] Update `CLIENT_URL` in Render with Vercel URL
- [ ] Restart Render service
- [ ] Test frontend connection to backend
- [ ] Verify CORS is working
- [ ] Test user registration
- [ ] Test login functionality

## Important Notes

1. **Order Matters**: Deploy backend first, then frontend, then update CLIENT_URL
2. **URL Format**: 
   - Backend: `https://your-backend.onrender.com` (no trailing slash)
   - Frontend API URL: `https://your-backend.onrender.com/api` (with `/api`)
   - Frontend: `https://your-app.vercel.app` (no trailing slash)
3. **CORS**: Make sure CLIENT_URL in Render exactly matches your Vercel URL
4. **Environment Variables**: 
   - Vercel variables must start with `VITE_` to be accessible in client code
   - Render variables are server-side only
5. **Restart Services**: Always restart Render service after updating environment variables

## Testing After Deployment

1. Visit frontend URL
2. Open browser console (F12)
3. Check for any CORS or connection errors
4. Try registering a new user
5. Check Network tab to verify API calls are going to Render backend
6. Test login functionality
7. Verify cookies are being set (check Application tab)

## Support Resources

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- See `DEPLOYMENT.md` for detailed instructions
- See `ENV_SETUP.md` for quick reference
