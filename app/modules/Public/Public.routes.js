import { Router } from "express";
import { getPublicPrescription } from "./Public.controller.js";

const PublicRoutes = Router();

// Public route to view prescription by its 8-digit string ID
PublicRoutes.get("/prescription/:id", getPublicPrescription);

export default PublicRoutes;
