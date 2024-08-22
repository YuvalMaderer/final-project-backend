import { Router } from "express";
import { getHomesForHomePage } from "../controllers/homes-controller";

export const homeRoutes = Router();

homeRoutes.get("/24homes", getHomesForHomePage);
