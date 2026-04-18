import {
  createUser,
  getAllUsers,
  getUserByBranch,
  getUserById,
  removeUser,
  updateUser,
  loginUser,
  logoutUser,
  changePassword,
} from "./Users.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";
import { Router } from "express";

const UserRoutes = Router();

// Public Routes
UserRoutes.post("/login", loginUser);
UserRoutes.post("/post", createUser);

// Protected Routes
UserRoutes.get("/", authenticateToken, getAllUsers);
UserRoutes.get("/branch/:branch", authenticateToken, getUserByBranch);
UserRoutes.get("/get-id/:id", authenticateToken, getUserById);
UserRoutes.post("/logout", authenticateToken, logoutUser);
UserRoutes.delete("/delete/:id", authenticateToken, removeUser);
UserRoutes.put("/update/:id", authenticateToken, updateUser);
UserRoutes.put("/change-password", authenticateToken, changePassword);

export default UserRoutes;