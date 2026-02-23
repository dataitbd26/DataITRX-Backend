import { Router } from "express";
import {
  createUser,
  getAllUsers,
changePasswordprofile,
  getUserById,
  removeUser,
  getUserRoles,
  updateUser,
  loginUser,
  logoutUser,
  changePassword,
} from "./Users.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js"; 

const UserRoutes = Router();

UserRoutes.post("/login", loginUser); 
// UserRoutes.post("/post",authenticateToken, createUser);


UserRoutes.get("/",authenticateToken,  getAllUsers);

UserRoutes.get("/get-id/:id", authenticateToken, getUserById);
UserRoutes.post("/logout", authenticateToken, logoutUser);
// UserRoutes.delete("/delete/:id", authenticateToken, removeUser);
UserRoutes.put("/update/:id", authenticateToken, updateUser);
UserRoutes.put("/change-password", authenticateToken, changePassword);
UserRoutes.get("/roles", getUserRoles);
UserRoutes.put("/change-password-profile", authenticateToken, changePasswordprofile); 



export default UserRoutes;
