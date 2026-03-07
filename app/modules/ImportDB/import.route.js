import express from "express";
import multer from "multer";
import { importDatabase } from "./importController.js";
// import { protect, admin } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Configure multer to save files temporarily in an 'uploads' folder
const upload = multer({ dest: 'uploads/' });

// The field name 'backupFile' MUST match what we send from React
router.post("/", upload.single('backupFile'), importDatabase);

export default router;