import { Router } from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  removeNews,
} from "./News.controller.js";


const NewsRoutes = Router();

NewsRoutes.get("/get-all", getAllNews);

NewsRoutes.get("/get-id/:id", getNewsById);

NewsRoutes.post("/post", createNews);

NewsRoutes.put("/put/:id", updateNews);

NewsRoutes.delete("/delete/:id", removeNews);

export default NewsRoutes;
