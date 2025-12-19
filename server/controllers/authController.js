import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Category from '../models/Category.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const getCookieOptions = () => {
  // In production (Vercel <-> Render), cookies are cross-site and must be:
  // - secure: true
  // - sameSite: "none"
  //
  // In local development over http://, secure cookies will NOT be stored/sent,
  // so we must use secure: false and sameSite: "lax".
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

// @desc    Register user
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, geolocation } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      geolocation,
    });

    const token = generateToken(user._id);

    res.cookie('token', token, getCookieOptions());

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/user/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register provider
// @route   POST /api/auth/provider/register
// @access  Public
export const registerProvider = async (req, res, next) => {
  try {
    const {
      ownerName,
      serviceName,
      description,
      email,
      password,
      phone,
      address,
      geolocation,
      category,
      pricing,
      skills,
      experience,
    } = req.body;

    const provider = await Provider.create({
      ownerName,
      serviceName,
      description,
      email,
      password,
      phone,
      address,
      geolocation,
      category,
      pricing,
      skills,
      experience,
    });

    const token = generateToken(provider._id);

    res.cookie('token', token, getCookieOptions());

    res.status(201).json({
      success: true,
      data: {
        id: provider._id,
        serviceName: provider.serviceName,
        email: provider.email,
        role: provider.role,
        status: provider.status,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login provider
// @route   POST /api/auth/provider/login
// @access  Public
export const loginProvider = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const provider = await Provider.findOne({ email }).select('+password');

    if (!provider || !(await provider.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(provider._id);

    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        id: provider._id,
        serviceName: provider.serviceName,
        email: provider.email,
        role: provider.role,
        status: provider.status,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if admin user exists, if not create one
    let admin = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!admin) {
      // Create admin if doesn't exist (first time setup)
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        admin = await User.create({
          name: 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin',
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
    }

    if (!(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(admin._id);

    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
// controllers/authController.js

export const logout = async (req, res) => {
  // Clear cookie using same attributes that were used to set it
  res.cookie('token', '', { ...getCookieOptions(), expires: new Date(0) });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


// @desc    Get reset token
// @route   POST /api/auth/reset-token
// @access  Public
export const getResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    const provider = await Provider.findOne({ email });

    if (!user && !provider) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const account = user || provider;
    const resetToken = crypto.randomBytes(20).toString('hex');

    account.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    account.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await account.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: account.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(200).json({
        success: true,
        message: 'Email sent',
      });
    } catch (error) {
      account.resetPasswordToken = undefined;
      account.resetPasswordExpire = undefined;
      await account.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    const provider = await Provider.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user && !provider) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const account = user || provider;
    account.password = req.body.password;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;

    await account.save();

    const token = generateToken(account._id);

    res.cookie('token', token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories (public)
// @route   GET /api/auth/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select('name _id');

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
