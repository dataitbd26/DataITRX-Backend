import { Router } from "express";
import {
  createDoctorDepartment,
  getAllDoctorDepartments,
  getDoctorDepartmentById,
  updateDoctorDepartment,
  removeDoctorDepartment,
} from "./DoctorDepartments.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const DoctorDepartmentRoutes = Router();

// Protect all routes with authentication middleware
DoctorDepartmentRoutes.get("/", authenticateToken, getAllDoctorDepartments);
DoctorDepartmentRoutes.get("/get-id/:id", authenticateToken, getDoctorDepartmentById);
DoctorDepartmentRoutes.post("/post", authenticateToken, createDoctorDepartment);
DoctorDepartmentRoutes.put("/update/:id", authenticateToken, updateDoctorDepartment);
DoctorDepartmentRoutes.delete("/delete/:id", authenticateToken, removeDoctorDepartment);

export default DoctorDepartmentRoutes;