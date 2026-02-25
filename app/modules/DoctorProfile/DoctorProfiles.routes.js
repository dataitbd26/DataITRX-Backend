import { Router } from "express";
import {
  createDoctorProfile,
  getAllDoctorProfiles,
  getDoctorProfileById,
  getDoctorProfilesByBranch,
  updateDoctorProfile,
  removeDoctorProfile,
} from "./DoctorProfiles.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js"; 

const DoctorProfileRoutes = Router();

// Protect all routes with authentication middleware
DoctorProfileRoutes.get("/", authenticateToken, getAllDoctorProfiles);
DoctorProfileRoutes.get("/:branch/get-all", authenticateToken, getDoctorProfilesByBranch);
DoctorProfileRoutes.get("/get-id/:id", authenticateToken, getDoctorProfileById);
DoctorProfileRoutes.post("/post", authenticateToken, createDoctorProfile);
DoctorProfileRoutes.put("/update/:id", authenticateToken, updateDoctorProfile);
DoctorProfileRoutes.delete("/delete/:id", authenticateToken, removeDoctorProfile);

export default DoctorProfileRoutes;