# Deployment Guide

This guide will help you deploy ServiceHub to Vercel (Frontend) and Render (Backend).

## Prerequisites

- GitHub account (for connecting repositories)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)
- MongoDB Atlas account (or your MongoDB database)
- Cloudinary account (for image uploads - optional)

---

## Backend Deployment (Render)

### Step 1: Prepare Backend Environment Variables

1. Go to your Render dashboard
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `servicehub-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to `server` if needed)

### Step 2: Set Environment Variables in Render

Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=5000

# Frontend URL (Vercel deployment)
CLIENT_URL=https://your-frontend-app.vercel.app

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Credentials (for first-time admin login)
ADMIN_EMAIL=admin@servicehub.com
ADMIN_PASSWORD=Admin@123

# Email Configuration (Optional - for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Step 3: Deploy Backend

1. Click **Create Web Service**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://servicehub-backend.onrender.com`)

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Make sure your `client` folder has a `package.json` with build scripts
2. Push your code to GitHub

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables in Vercel

Add this environment variable in Vercel dashboard:

```env
VITE_API_URL=https://your-backend-app.onrender.com/api
```

**Important**: Replace `your-backend-app.onrender.com` with your actual Render backend URL.

### Step 4: Deploy Frontend

1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://servicehub.vercel.app`)

---

## Post-Deployment Configuration

### Step 1: Update Backend CLIENT_URL

1. Go back to Render dashboard
2. Update the `CLIENT_URL` environment variable with your Vercel frontend URL:
   ```
   CLIENT_URL=https://your-frontend-app.vercel.app
   ```
3. Restart the service (Render will auto-restart)

### Step 2: Verify CORS

1. Check Render logs to see if CORS is working
2. You should see: `🌐 Allowed Origins: [ 'https://your-frontend-app.vercel.app', ... ]`

### Step 3: Test the Application

1. Visit your Vercel frontend URL
2. Try registering a new user
3. Check browser console for any errors
4. Check Network tab to verify API calls are going to Render backend

---

## Environment Variables Summary

### Backend (Render) - Required:
- `NODE_ENV=production`
- `PORT=5000`
- `CLIENT_URL` - Your Vercel frontend URL
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string
- `JWT_EXPIRE=7d`
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password

### Backend (Render) - Optional:
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - For password reset emails
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - For image uploads

### Frontend (Vercel) - Required:
- `VITE_API_URL` - Your Render backend URL + `/api`
  - Example: `https://servicehub-backend.onrender.com/api`

---

## Troubleshooting

### CORS Errors

**Problem**: Browser shows CORS errors when making API requests

**Solution**:
1. Verify `CLIENT_URL` in Render matches your Vercel URL exactly (including `https://`)
2. Make sure there's no trailing slash in `CLIENT_URL`
3. Restart Render service after updating `CLIENT_URL`

### API Connection Errors

**Problem**: Frontend can't connect to backend

**Solution**:
1. Verify `VITE_API_URL` in Vercel is correct
2. Make sure it includes `/api` at the end
3. Check Render service is running and healthy
4. Test backend health endpoint: `https://your-backend.onrender.com/api/health`

### Environment Variables Not Working

**Problem**: Environment variables not being read

**Solution**:
1. **Vercel**: Make sure variable names start with `VITE_` for client-side access
2. **Render**: Restart service after adding/updating variables
3. Check for typos in variable names
4. Verify no extra spaces in values

### Build Failures

**Problem**: Build fails on Vercel or Render

**Solution**:
1. Check build logs for specific errors
2. Verify all dependencies are in `package.json`
3. Make sure Node.js version is compatible (check `package.json` engines)
4. For Vercel: Check that root directory is set to `client`

---

## Local Development Setup

### Backend `.env` file:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your-local-secret-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@servicehub.com
ADMIN_PASSWORD=Admin@123
```

### Frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Security Notes

1. **Never commit `.env` files** to Git
2. Use strong, unique `JWT_SECRET` in production
3. Use strong `ADMIN_PASSWORD` in production
4. Keep MongoDB connection string secure
5. Regularly rotate API keys and secrets

---

## Support

If you encounter issues:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend build errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly
