import { Router } from "express";

import {
    createPrescriptionTemplate,
    getAllPrescriptionTemplates,
    getPrescriptionTemplateById,
    getPrescriptionTemplatesByDoctor,
    updatePrescriptionTemplate,
    removePrescriptionTemplate,
} from "./PrescriptionTemplates.controller.js";

import { authenticateToken } from "../../../middleware/authMiddleware.js";

const PrescriptionTemplateRoutes = Router();

// Protect all routes with authentication middleware
PrescriptionTemplateRoutes.get("/", authenticateToken, getAllPrescriptionTemplates);
PrescriptionTemplateRoutes.get("/:doctorId/get-all", authenticateToken, getPrescriptionTemplatesByDoctor);
PrescriptionTemplateRoutes.get("/get-id/:id", authenticateToken, getPrescriptionTemplateById);
PrescriptionTemplateRoutes.post("/post", authenticateToken, createPrescriptionTemplate);
PrescriptionTemplateRoutes.put("/update/:id", authenticateToken, updatePrescriptionTemplate);
PrescriptionTemplateRoutes.delete("/delete/:id", authenticateToken, removePrescriptionTemplate);

export default PrescriptionTemplateRoutes;