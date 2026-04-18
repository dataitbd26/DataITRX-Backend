import express from "express";
import { getSuperAdminDashboard } from "./dashboard.controller.js";
import { getBranchDashboard } from "./branchDashboard.controller.js";

const router = express.Router();

// Only SuperAdmin can access this route
router.get("/super-admin", getSuperAdminDashboard);

router.get("/branch", getBranchDashboard);
export default router;