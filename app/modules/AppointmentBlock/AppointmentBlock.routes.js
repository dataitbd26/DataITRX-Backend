import { Router } from "express";
import {
    createAppointmentBlock,
    getAllAppointmentBlocks,
    getAppointmentBlockById,
    getAppointmentBlocksByBranch,
    updateAppointmentBlock,
    removeAppointmentBlock,
} from "./AppointmentBlock.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const AppointmentBlockRoutes = Router();

// Protect all routes with authentication middleware
AppointmentBlockRoutes.get("/", authenticateToken, getAllAppointmentBlocks);
AppointmentBlockRoutes.get("/:branch/get-all", authenticateToken, getAppointmentBlocksByBranch);
AppointmentBlockRoutes.get("/get-id/:id", authenticateToken, getAppointmentBlockById);
AppointmentBlockRoutes.post("/post", authenticateToken, createAppointmentBlock);
AppointmentBlockRoutes.put("/update/:id", authenticateToken, updateAppointmentBlock);
AppointmentBlockRoutes.delete("/delete/:id", authenticateToken, removeAppointmentBlock);

export default AppointmentBlockRoutes;