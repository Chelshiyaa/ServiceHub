# ServiceHub - Local Service Discovery & Management Platform

A full-featured MERN Stack application where users can search for nearby services (electricians, plumbers, tutors, beauticians, mechanics, etc.), service providers can register themselves and manage their profiles, and admin can manage the entire platform.

## Features

### User Features
- 🔍 Search services by type, location, and distance
- ⭐ Filter by ratings and availability
- ❤️ Save favorite providers
- 👤 Manage personal profile
- 📍 Geolocation-based search

### Service Provider Features
- 📝 Register and manage profile
- 📸 Upload service images
- ⏰ Set availability schedule
- 📊 View profile status (pending/approved/rejected)
- 💰 Set pricing information

### Admin Features
- 📊 Complete dashboard with statistics
- 👥 Manage users (CRUD)
- 🏢 Manage service providers (approve/reject/CRUD)
- 🏷️ Manage service categories (CRUD)
- 📈 View platform statistics

## Technology Stack

### Frontend
- React.js
- Redux Toolkit (state management)
- React Router DOM
- TailwindCSS
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt password hashing
- Cloudinary for image uploads
- Cookie-based authentication

## Project Structure

```
ServiceHub/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Backend Express application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@servicehub.com
ADMIN_PASSWORD=admin123
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## API Endpoints

### Auth Routes
- `POST /api/auth/user/register` - Register new user
- `POST /api/auth/user/login` - User login
- `POST /api/auth/provider/register` - Register new provider
- `POST /api/auth/provider/login` - Provider login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/reset-token` - Request password reset
- `POST /api/auth/reset-password/:resettoken` - Reset password

### User Routes
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/search` - Search services
- `POST /api/user/favorites/:id` - Toggle favorite provider

### Provider Routes
- `GET /api/provider/profile` - Get provider profile
- `PUT /api/provider/profile` - Update provider profile
- `POST /api/provider/services/images` - Upload service images
- `DELETE /api/provider/services/images/:id` - Delete service image

### Admin Routes
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/providers` - Get all providers
- `PUT /api/admin/provider/status/:id` - Update provider status
- `GET /api/admin/category` - Get all categories
- `POST /api/admin/category` - Create category
- `PUT /api/admin/category/:id` - Update category
- `DELETE /api/admin/category/:id` - Delete category

## Default Admin Credentials

After first server start, you can login with:
- Email: `admin@servicehub.com`
- Password: `admin123`

**⚠️ Important:** Change these credentials after first login!

## Usage

1. **As a User:**
   - Register/Login
   - Search for services
   - View provider details
   - Add providers to favorites
   - Update profile

2. **As a Service Provider:**
   - Register with service details
   - Wait for admin approval
   - Manage profile and services
   - Upload service images

3. **As an Admin:**
   - Login with admin credentials
   - View dashboard statistics
   - Approve/reject providers
   - Manage users and categories

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password
- `ADMIN_EMAIL` - Default admin email
- `ADMIN_PASSWORD` - Default admin password

### Client (.env)
- `VITE_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@servicehub.com or open an issue in the repository.

