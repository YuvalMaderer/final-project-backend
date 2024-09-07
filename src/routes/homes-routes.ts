import { Router } from "express";
import {
  getHomesForHomePage,
  getAllHomesByFilter,
  getHomeById,
  getAllHomesCountByFilter,
  CreateNewHome,
  updateHome,
  getHomesByHost,
  deleteHomeById,
} from "../controllers/homes-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const homeRoutes = Router();

homeRoutes.get("/24homes", getHomesForHomePage);
homeRoutes.get("/filters", getAllHomesByFilter);
homeRoutes.get("/host", verifyToken, getHomesByHost);
homeRoutes.get("/count", getAllHomesCountByFilter);
homeRoutes.get("/:homeId", getHomeById);
homeRoutes.post("/create", verifyToken, CreateNewHome);
homeRoutes.patch("/update/:homeId", verifyToken, updateHome);
homeRoutes.patch("/delete/:homeId", verifyToken, deleteHomeById);
