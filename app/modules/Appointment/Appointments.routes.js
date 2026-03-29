import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByBranch,
  updateAppointment,
  removeAppointment,
} from "./Appointments.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const AppointmentRoutes = Router();


AppointmentRoutes.get("/", authenticateToken, getAllAppointments);
AppointmentRoutes.get("/:branch/get-all", authenticateToken, getAppointmentsByBranch);
AppointmentRoutes.get("/get-id/:id", authenticateToken, getAppointmentById);
AppointmentRoutes.post("/post", authenticateToken, createAppointment);
AppointmentRoutes.put("/update/:id", authenticateToken, updateAppointment);
AppointmentRoutes.delete("/delete/:id", authenticateToken, removeAppointment);

export default AppointmentRoutes;

