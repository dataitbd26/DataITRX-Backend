import express from "express";
import environment from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import routes from "./routes/routes.js";
import path from "path";
import passport from "passport";
import fileUpload from "express-fileupload";

environment.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hidePoweredBy: true,
  })
);

app.use(passport.initialize());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1000,
  })
);

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://mondol-agro-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(">> REQUEST ORIGIN:", origin);
      const normalizedOrigin = origin?.endsWith("/")
        ? origin.slice(0, -1)
        : origin;

      if (allowedOrigins.includes(normalizedOrigin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FILE UPLOAD MIDDLEWARE
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true,
  })
);

// Static
app.use(express.static("public"));

// Routes
app.use("/api", routes);

// Root
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running." });
});

// Error handler
app.use(errorHandler);

// Start
app.listen(port, () => {
  console.log(`Server started at ${new Date()}`);
});



