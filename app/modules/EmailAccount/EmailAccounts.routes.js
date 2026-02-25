import { Router } from "express";
import {
  createEmailAccount,
  getAllEmailAccounts,
  getEmailAccountById,
  updateEmailAccount,
  removeEmailAccount,
  getSuperAdminEmailAccounts,
} from "./EmailAccounts.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js"; 

const EmailAccountRoutes = Router();

// Protect all routes with authentication middleware
EmailAccountRoutes.get("/", authenticateToken, getAllEmailAccounts);
EmailAccountRoutes.get("/get-id/:id", authenticateToken, getEmailAccountById);
EmailAccountRoutes.post("/post", authenticateToken, createEmailAccount);
EmailAccountRoutes.put("/update/:id", authenticateToken, updateEmailAccount);
EmailAccountRoutes.delete("/delete/:id", authenticateToken, removeEmailAccount);
EmailAccountRoutes.get("/superadmin/all", authenticateToken, getSuperAdminEmailAccounts);

export default EmailAccountRoutes;