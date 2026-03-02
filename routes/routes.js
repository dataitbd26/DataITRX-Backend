import { Router } from "express";

import permissionRoutes from "../app/modules/Permission/permission.routes.js";
import userRoutes from "../app/modules/User/Users.routes.js";
import UserlogRoutes from "../app/modules/UserLog/UserLog.routes.js";
import TransactionLogRoutes from "../app/modules/TransactionLog/TransactionLog.routes.js";
import UserRoleRoutes from "../app/modules/UserRole/UserRoles.routes.js";
import DoctorProfileRoutes from "../app/modules/DoctorProfile/DoctorProfiles.routes.js";
import DoctorDepartmentRoutes from "../app/modules/DoctorDepartment/DoctorDepartments.routes.js";
import ChamberRoutes from "../app/modules/Chamber/Chambers.routes.js";
import LabtestRoutes from "../app/modules/Labtest/Labtests.routes.js";
import MedicinesRoutes from "../app/modules/Medicine/Medicine.routes.js";
import MedicineManufacturerRoutes from "../app/modules/MedicineManufacturer/MedicineManufacturers.routes.js";
// Used Controllers / Middleware
import { getImageUrl } from "../config/space.js";
import transactionLogger from "../middleware/transactionLogger.js";

const routes = Router();

// Middleware
routes.use(transactionLogger);

// Active Routes

routes.use("/permissions", permissionRoutes);
routes.use("/user", userRoutes);
routes.use("/userlog", UserlogRoutes);
routes.use("/transaction-logs", TransactionLogRoutes);
routes.use("/userrole", UserRoleRoutes);
routes.use("/doctor-profiles", DoctorProfileRoutes);
routes.use("/doctor-departments", DoctorDepartmentRoutes);
routes.post("/get-image-url", getImageUrl);
routes.use("/chambers", ChamberRoutes);
routes.use("/labtests", LabtestRoutes);
routes.use("/medicines", MedicinesRoutes);
routes.use("/medicine-manufacturers", MedicineManufacturerRoutes);
export default routes;
