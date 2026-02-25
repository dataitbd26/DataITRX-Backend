import { Router } from "express";
import {
  createChamber,
  getAllChambers,
  getChamberById,
  getChambersByBranch,
  updateChamber,
  removeChamber,
} from "./Chambers.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const ChamberRoutes = Router();

// Protect all routes with authentication middleware
ChamberRoutes.get("/", authenticateToken, getAllChambers);
ChamberRoutes.get("/:branch/get-all", authenticateToken, getChambersByBranch);
ChamberRoutes.get("/get-id/:id", authenticateToken, getChamberById);
ChamberRoutes.post("/post", authenticateToken, createChamber);
ChamberRoutes.put("/update/:id", authenticateToken, updateChamber);
ChamberRoutes.delete("/delete/:id", authenticateToken, removeChamber);

export default ChamberRoutes;