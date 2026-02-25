import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Category from "../models/Category.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

/* ============================
   COOKIE OPTIONS (ENV-BASED)
============================ */
const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,                 // true only on HTTPS prod
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

/* ============================
   USER AUTH
============================ */
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
    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email & password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
   PROVIDER AUTH
============================ */
export const registerProvider = async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body);
    const token = generateToken(provider._id);

    res.cookie("token", token, getCookieOptions());

    res.status(201).json({
      success: true,
      data: {
        id: provider._id,
        serviceName: provider.serviceName,
        email: provider.email,
        role: provider.role,
        status: provider.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginProvider = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const provider = await Provider.findOne({ email }).select("+password");
    if (!provider || !(await provider.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(provider._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        id: provider._id,
        serviceName: provider.serviceName,
        email: provider.email,
        role: provider.role,
        status: provider.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
   ADMIN AUTH
============================ */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let admin = await User.findOne({ email, role: "admin" }).select("+password");

    if (!admin) {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        admin = await User.create({
          name: "Admin",
          email,
          password,
          role: "admin",
        });
      } else {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    }

    if (!(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(admin._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
   LOGOUT
============================ */
export const logout = async (req, res) => {
  res.cookie("token", "", { ...getCookieOptions(), expires: new Date(0) });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/* ============================
   RESET PASSWORD
============================ */
export const getResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const provider = await Provider.findOne({ email });
    if (!user && !provider)
      return res.status(404).json({ success: false, message: "User not found" });

    const account = user || provider;
    const resetToken = crypto.randomBytes(20).toString("hex");

    account.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    account.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await account.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
    const message = `Reset your password using this link:\n\n${resetUrl}`;

    await sendEmail({ email: account.email, subject: "Password Reset", message });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    const provider = await Provider.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user && !provider)
      return res.status(400).json({ success: false, message: "Invalid token" });

    const account = user || provider;
    account.password = req.body.password;
    account.resetPasswordToken = undefined;
    account.resetPasswordExpire = undefined;
    await account.save();

    const token = generateToken(account._id);
    res.cookie("token", token, getCookieOptions());

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

/* ============================
   PUBLIC CATEGORIES (FIXED)
============================ */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select("name _id");
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================
   ME
============================ */
export const getMe = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};