import { Router } from "express";
import {
    createPatient,
    getAllPatients,
    getPatientById,
    getPatientsByBranch,
    updatePatient,
    removePatient,
} from "./Patients.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const PatientRoutes = Router();

// Protect all routes with authentication middleware
PatientRoutes.get("/", authenticateToken, getAllPatients);
PatientRoutes.get("/:branch/get-all", authenticateToken, getPatientsByBranch);
PatientRoutes.get("/get-id/:id", authenticateToken, getPatientById);
PatientRoutes.post("/post", authenticateToken, createPatient);
PatientRoutes.put("/update/:id", authenticateToken, updatePatient);
PatientRoutes.delete("/delete/:id", authenticateToken, removePatient);

export default PatientRoutes;