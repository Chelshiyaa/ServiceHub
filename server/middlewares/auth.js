import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Provider from '../models/Provider.js';

export const protect = async (req, res, next) => {
  let token;

  // 1) Prefer HttpOnly cookie (recommended in production)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2) Fallback to Authorization header (helps when cookies aren't sent)
  if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (process.env.NODE_ENV !== 'production') {
    const hasCookie = Boolean(req.cookies?.token);
    const hasAuthHeader = Boolean(req.headers?.authorization);
    console.log(
      `[auth] ${req.method} ${req.originalUrl} | cookie=${hasCookie} authHeader=${hasAuthHeader}`
    );
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.id);
    const provider = await Provider.findById(decoded.id);
    
    if (!user && !provider) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user || provider;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

