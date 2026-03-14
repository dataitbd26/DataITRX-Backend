import { Router } from "express";

import {
  createPreCheckup,
  getAllPreCheckups,
  getPreCheckupsByBranch,
  getPreCheckupById,
  updatePreCheckup,
  removePreCheckup,
  createPatientWithPreCheckup
} from "./PreCheckups.controller.js";

import { authenticateToken } from "../../../middleware/authMiddleware.js";

const PreCheckupRoutes = Router();

// Protect all routes with authentication middleware

PreCheckupRoutes.get("/", authenticateToken, getAllPreCheckups);

PreCheckupRoutes.get("/:branch/get-all", authenticateToken, getPreCheckupsByBranch);

PreCheckupRoutes.get("/get-id/:id", authenticateToken, getPreCheckupById);

PreCheckupRoutes.post("/post", authenticateToken, createPreCheckup);

PreCheckupRoutes.put("/update/:id", authenticateToken, updatePreCheckup);

PreCheckupRoutes.delete("/delete/:id", authenticateToken, removePreCheckup);

// Patient + PreCheckup together
PreCheckupRoutes.post("/create-full", authenticateToken, createPatientWithPreCheckup);

export default PreCheckupRoutes;