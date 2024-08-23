import { Router } from "express";
import {
  getHomesForHomePage,
  getAllHomesByFilter,
} from "../controllers/homes-controller";

export const homeRoutes = Router();

homeRoutes.get("/24homes", getHomesForHomePage);
homeRoutes.get("/filters", getAllHomesByFilter);
