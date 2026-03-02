// MedicineManufacturers.routes.js

import { Router } from "express";
import {
  createMedicineManufacturer,
  getAllMedicineManufacturers,
  getMedicineManufacturerById,
  getMedicineManufacturersByStatus,
  updateMedicineManufacturer,
  removeMedicineManufacturer,
} from "./MedicineManufacturers.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js"; 

const MedicineManufacturerRoutes = Router();

// Protect all routes with authentication middleware
MedicineManufacturerRoutes.get("/", authenticateToken, getAllMedicineManufacturers);
MedicineManufacturerRoutes.get("/:status/get-all", authenticateToken, getMedicineManufacturersByStatus);
MedicineManufacturerRoutes.get("/get-id/:id", authenticateToken, getMedicineManufacturerById);
MedicineManufacturerRoutes.post("/post", authenticateToken, createMedicineManufacturer);
MedicineManufacturerRoutes.put("/update/:id", authenticateToken, updateMedicineManufacturer);
MedicineManufacturerRoutes.delete("/delete/:id", authenticateToken, removeMedicineManufacturer);

export default MedicineManufacturerRoutes;