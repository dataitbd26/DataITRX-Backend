import express from "express";
import { exportFullDatabase } from "./exportController.js";
// import { protect, admin } from "../middleware/authMiddleware.js"; // HIGHLY recommended to uncomment this!

const router = express.Router();

// This will be accessible at: YOUR_API_URL/export
router.get("/", exportFullDatabase);

export default router;