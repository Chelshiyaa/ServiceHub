# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or MongoDB Atlas account)
- Cloudinary account (free tier works)

## Step 1: Clone and Setup

```bash
# Navigate to project directory
cd ServiceHub
```

## Step 2: Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configurations:
# - MongoDB URI (local or Atlas)
# - Cloudinary credentials
# - JWT secret
# - Email settings (optional for password reset)
```

## Step 3: Frontend Setup

```bash
cd ../client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## Step 4: Start Development Servers

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

## Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Step 6: First Login

1. Go to http://localhost:3000/login
2. Select "Admin" role
3. Login with:
   - Email: `admin@servicehub.com`
   - Password: `admin123`

4. Create some categories first (Admin Dashboard > Categories)
5. Then register as a provider or user

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running locally, or
- Update MONGODB_URI in server/.env with your Atlas connection string

### Cloudinary Upload Fails
- Verify your Cloudinary credentials in server/.env
- Make sure the API keys are correct

### CORS Errors
- Check that CLIENT_URL in server/.env matches your frontend URL
- Default is http://localhost:3000

## Next Steps

1. Create service categories as admin
2. Register as a service provider
3. Wait for admin approval (or approve yourself)
4. Search for services as a user
5. Explore all features!

