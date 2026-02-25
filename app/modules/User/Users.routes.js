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
import jwt from "jsonwebtoken";
import passport from 'passport';
import { authenticateToken } from "../../../middleware/authMiddleware.js"; 
import { Router } from "express";



const UserRoutes = Router();


UserRoutes.post("/login", loginUser); // Login does not require a token
UserRoutes.post("/post", createUser); // If creating a user should also be public

UserRoutes.get("/", authenticateToken, getAllUsers);
UserRoutes.get("/:branch/get-all", authenticateToken, getUserByBranch);
UserRoutes.get("/get-id/:id", authenticateToken, getUserById);
UserRoutes.post("/logout", authenticateToken, logoutUser);
UserRoutes.delete("/delete/:id", authenticateToken, removeUser);
UserRoutes.put("/update/:id", authenticateToken, updateUser);

UserRoutes.put("/change-password", authenticateToken, changePassword);


export default UserRoutes;
