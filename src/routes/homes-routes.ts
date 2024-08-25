import { Router } from "express";
import {
  getHomesForHomePage,
  getAllHomesByFilter,
  getHomeById,
} from "../controllers/homes-controller";

export const homeRoutes = Router();

homeRoutes.get("/24homes", getHomesForHomePage);
homeRoutes.get("/filters", getAllHomesByFilter);
homeRoutes.get("/:homeId", getHomeById);
