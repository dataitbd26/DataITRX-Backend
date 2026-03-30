import { Router } from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  removeNews,
  getNewsByBranch, // <-- Import the new function
} from "./News.controller.js";

const NewsRoutes = Router();

NewsRoutes.get("/get-all", getAllNews);

// --- Add the new branch route ---
NewsRoutes.get("/:branch/get-all", getNewsByBranch);
// --------------------------------

NewsRoutes.get("/get-id/:id", getNewsById);

NewsRoutes.post("/post", createNews);

NewsRoutes.put("/put/:id", updateNews);

NewsRoutes.delete("/delete/:id", removeNews);

export default NewsRoutes;