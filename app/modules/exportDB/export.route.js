import express from "express";
import { exportFullDatabase } from "../controllers/exportController.js";
// import { protect, admin } from "../middleware/authMiddleware.js"; // Highly recommended!

const router = express.Router();

// Add the export route
// In production, you should wrap this like: router.get("/export-db", protect, admin, exportFullDatabase);
router.get("/export-db", exportFullDatabase);

// ... your other routes ...

export default router;