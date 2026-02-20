import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Try server/.env first, then repo-root .env (common setup)
dotenv.config({ path: join(__dirname, ".env") });
dotenv.config({ path: join(__dirname, "..", ".env") });

// Import routes (after env is loaded)
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Connect to database
connectDB();

const app = express();

// Allowed Frontend Domains
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",

  // ✅ Vercel domains (ADD BOTH)
  "https://service-hub-git-main-chelshiyas-projects.vercel.app",
  "https://service-6kaiougi1-chelshiyas-projects.vercel.app",
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

// Preflight Requests
app.options("*", cors(corsOptions));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌐 Allowed Origins:", allowedOrigins);
});
