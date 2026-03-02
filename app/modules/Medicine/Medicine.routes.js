import { Router } from "express";
import {
  createMedicine,
  getAllMedicine,
  getAllMedicines,
  getByIdMedicine,
  removeMedicine,
  updateMedicine,
  getMedicineByManufacturer,
  getMedicineByGenericName,
} from "./Medicine.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const MedicineRoutes = Router();

// Protect all routes with authentication middleware
MedicineRoutes.get("/",  getAllMedicines);
MedicineRoutes.get("/get-all", authenticateToken, getAllMedicine); // Kept for consistency with template structure
MedicineRoutes.get("/get-id/:id", authenticateToken, getByIdMedicine);
MedicineRoutes.get("/filter/manufacturer/:manufacturer", authenticateToken, getMedicineByManufacturer);
MedicineRoutes.get("/filter/generic/:genericName", authenticateToken, getMedicineByGenericName);
MedicineRoutes.post("/post", authenticateToken, createMedicine);
MedicineRoutes.delete("/delete/:id", authenticateToken, removeMedicine);
MedicineRoutes.put("/update/:id", authenticateToken, updateMedicine);

export default MedicineRoutes;