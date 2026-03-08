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
import DoctorWebsiteRoutes from "../app/modules/Doctorwebsite/doctorwebsite.routes.js";
import PrescriptionTemplateRoutes from "../app/modules/PrescriptionTemplates/PrescriptionTemplates.routes.js";
import PrescriptionRoutes from "../app/modules/Prescription/Prescription.routes.js";


// Used Controllers / Middleware
import { getImageUrl } from "../config/space.js";
import transactionLogger from "../middleware/transactionLogger.js";
import LabTestDeptRoutes from "../app/modules/LabTestDept/LabTestDept.routes.js";
import PatientRoutes from "../app/modules/Patient/Patients.routes.js";
import ExportRoutes from "../app/modules/exportDB/export.route.js";
import ImportRoutes from "../app/modules/ImportDB/import.route.js";




import { getBranchDoctorNames } from "../app/modules/DoctorProfile/DoctorProfiles.controller.js";


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
routes.use("/export", ExportRoutes);
routes.use("/import", ImportRoutes);
routes.use("/prescriptions", PrescriptionRoutes);
routes.use("/doctorwebsite", DoctorWebsiteRoutes);
routes.use("/labtestdepts", LabTestDeptRoutes);
routes.use("/lab-test-dept", LabTestDeptRoutes);
routes.use("/patients", PatientRoutes);
routes.use("/prescription-templates", PrescriptionTemplateRoutes);
routes.get("/branch-doctor-list", getBranchDoctorNames);

export default routes;
