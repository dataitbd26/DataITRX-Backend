import { Router } from "express";
import {
  getPermissionsByRole,
  updatePermissions,
} from "./permission.controller.js";

const permissionRoutes = Router();

permissionRoutes.get("/:role", getPermissionsByRole);

permissionRoutes.put("/", updatePermissions);



export default permissionRoutes;
