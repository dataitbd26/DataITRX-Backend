import { Router } from "express";

import {
    getAllTemplates,
    getTemplatesByBranch,
    getTemplateById,
    createTemplate,
    updateTemplate,
    removeTemplate
} from "./PrescriptionTemplates.controller.js";

import { authenticateToken } from "../../../middleware/authMiddleware.js";

const PrescriptionTemplateRoutes = Router();

PrescriptionTemplateRoutes.get("/", authenticateToken, getAllTemplates);

PrescriptionTemplateRoutes.get("/:branch/get-all", authenticateToken, getTemplatesByBranch);

PrescriptionTemplateRoutes.get("/get-id/:id", authenticateToken, getTemplateById);

PrescriptionTemplateRoutes.post("/post", authenticateToken, createTemplate);

PrescriptionTemplateRoutes.put("/update/:id", authenticateToken, updateTemplate);

PrescriptionTemplateRoutes.delete("/delete/:id", authenticateToken, removeTemplate);

export default PrescriptionTemplateRoutes;