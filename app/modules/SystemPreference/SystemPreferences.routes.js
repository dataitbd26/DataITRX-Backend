import { Router } from "express";
import {
    getPreferenceByBranch,
    upsertPreference,
    getAllPreferences
} from "./SystemPreferences.controller.js";
import { authenticateToken } from "../../../middleware/authMiddleware.js";

const SystemPreferenceRoutes = Router();


SystemPreferenceRoutes.get("/get-all", authenticateToken, getAllPreferences);
SystemPreferenceRoutes.get("/:branch", authenticateToken, getPreferenceByBranch);


SystemPreferenceRoutes.put("/upsert/:branch", authenticateToken, upsertPreference);

export default SystemPreferenceRoutes;