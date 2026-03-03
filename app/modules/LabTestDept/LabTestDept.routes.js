import { Router } from "express";
import {
  createLabTestDept,
  getAllLabTestDepts,
  getLabTestDeptById,
  getLabTestDeptsBySearch,
  updateLabTestDept,
  removeLabTestDept,
} from "./LabTestDept.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js"; 

const LabTestDeptRoutes = Router();

LabTestDeptRoutes.get("/", authenticateToken, getAllLabTestDepts);
LabTestDeptRoutes.get("/search/:departmentName", authenticateToken, getLabTestDeptsBySearch);
LabTestDeptRoutes.get("/get-id/:id", authenticateToken, getLabTestDeptById);
LabTestDeptRoutes.post("/post", authenticateToken, createLabTestDept);
LabTestDeptRoutes.put("/update/:id", authenticateToken, updateLabTestDept);
LabTestDeptRoutes.delete("/delete/:id", authenticateToken, removeLabTestDept);

export default LabTestDeptRoutes;