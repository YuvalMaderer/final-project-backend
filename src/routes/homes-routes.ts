import { Router } from "express";
import {
  getHomesForHomePage,
  getAllHomesByFilter,
  getHomeById,
  getAllHomesCountByFilter,
  CreateNewHome,
  updateHome,
} from "../controllers/homes-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const homeRoutes = Router();

homeRoutes.get("/24homes", getHomesForHomePage);
homeRoutes.get("/filters", getAllHomesByFilter);
homeRoutes.get("/count", getAllHomesCountByFilter);
homeRoutes.get("/:homeId", getHomeById);
homeRoutes.post("/create", CreateNewHome);
homeRoutes.patch("/update/:homeId", verifyToken, updateHome);
