import { Router } from "express";
import {
  createLabtest,
  getAllLabtests,
  getLabtestById,
  updateLabtest,
  removeLabtest,
} from "./Labtests.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const LabtestRoutes = Router();

// Protect all routes with authentication middleware
LabtestRoutes.get("/", authenticateToken, getAllLabtests);
LabtestRoutes.get("/get-id/:id", authenticateToken, getLabtestById);
LabtestRoutes.post("/post", authenticateToken, createLabtest);
LabtestRoutes.put("/update/:id", authenticateToken, updateLabtest);
LabtestRoutes.delete("/delete/:id", authenticateToken, removeLabtest);

export default LabtestRoutes;