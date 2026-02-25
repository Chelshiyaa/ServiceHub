# Docker Setup Guide

This project is dockerized with separate containers for the client, server, and MongoDB database.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed

## Quick Start

### Production Build

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Development Build

```bash
# Build and start all services in development mode
docker-compose -f docker-compose.dev.yml up

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

## Services

- **Client**: React/Vite frontend served on port 3000 (production) or 3000 (dev)
- **Server**: Node.js/Express backend API on port 5000
- **MongoDB**: Database on port 27017

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
MONGODB_URI=mongodb://mongodb:27017/servicehub
PORT=5000
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (for bookings)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

For production, you can also set these in the `docker-compose.yml` file under the `server` service `environment` section.

## Building Individual Services

### Build client only:
```bash
docker build -t servicehub-client ./client
```

### Build server only:
```bash
docker build -t servicehub-server ./server
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Useful Commands

```bash
# Rebuild containers after code changes
docker-compose up -d --build

# Execute commands in a running container
docker-compose exec server npm run seed
docker-compose exec client sh

# View container logs
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb

# Remove all containers, networks, and volumes
docker-compose down -v --remove-orphans
```

