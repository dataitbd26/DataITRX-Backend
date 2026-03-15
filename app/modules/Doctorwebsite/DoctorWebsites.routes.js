import { Router } from "express";

import {
    createDoctorWebsite,
    getAllDoctorWebsites,
    getDoctorWebsiteById,
    getDoctorWebsitesByBranch,
    updateDoctorWebsite,
    removeDoctorWebsite,
} from "./DoctorWebsites.controller.js";

import { authenticateToken } from "../../../middleware/authMiddleware.js";

const DoctorWebsiteRoutes = Router();

// Protect all routes with authentication middleware
DoctorWebsiteRoutes.get("/", authenticateToken, getAllDoctorWebsites);
DoctorWebsiteRoutes.get("/:branch/get-all", authenticateToken, getDoctorWebsitesByBranch);
DoctorWebsiteRoutes.get("/get-id/:id", authenticateToken, getDoctorWebsiteById);
DoctorWebsiteRoutes.post("/post", authenticateToken, createDoctorWebsite);
DoctorWebsiteRoutes.put("/update/:id", authenticateToken, updateDoctorWebsite);
DoctorWebsiteRoutes.delete("/delete/:id", authenticateToken, removeDoctorWebsite);

export default DoctorWebsiteRoutes;