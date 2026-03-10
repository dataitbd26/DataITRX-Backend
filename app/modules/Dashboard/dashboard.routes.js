import express from "express";
import { getSuperAdminDashboard } from "./dashboard.controller.js";


const router = express.Router();

// Only SuperAdmin can access this route
router.get("/super-admin", getSuperAdminDashboard);

export default router;