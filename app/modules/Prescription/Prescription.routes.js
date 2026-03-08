import { Router } from "express";

import {
    getAllPrescriptions,
    getPrescriptionsByBranch,
    getPrescriptionById,
    createPrescription,
    updatePrescription,
    removePrescription
} from "./Prescription.controller.js";

import { authenticateToken } from "../../../middleware/authMiddleware.js";

const PrescriptionRoutes = Router();

PrescriptionRoutes.get("/", authenticateToken, getAllPrescriptions);

PrescriptionRoutes.get("/:branch/get-all", authenticateToken, getPrescriptionsByBranch);

PrescriptionRoutes.get("/get-id/:id", authenticateToken, getPrescriptionById);

PrescriptionRoutes.post("/post", authenticateToken, createPrescription);

PrescriptionRoutes.put("/update/:id", authenticateToken, updatePrescription);

PrescriptionRoutes.delete("/delete/:id", authenticateToken, removePrescription);

export default PrescriptionRoutes;