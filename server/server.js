import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env (server/.env first, then root .env)
dotenv.config({ path: join(__dirname, ".env") });
dotenv.config({ path: join(__dirname, "..", ".env") });

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Connect DB
connectDB();

const app = express();

/* ============================
   ALLOWED ORIGINS
============================ */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://service-hub-git-main-chelshiyas-projects.vercel.app",
  "https://service-6kaiougi1-chelshiyas-projects.vercel.app",
  "https://service-hub-bice.vercel.app",
];

/* ============================
   MIDDLEWARE (ORDER IMPORTANT)
============================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ============================
   CORS (FIXED)
============================ */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / postman / curl
      if (!origin) return callback(null, true);

      // Allow explicitly listed origins OR any Vercel deployment
      if (allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

/* ============================
   ROUTES
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

/* ============================
   ERROR HANDLER (LAST)
============================ */
app.use(errorHandler);

/* ============================
   START SERVER
============================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌐 Allowed Origins:", allowedOrigins);
});