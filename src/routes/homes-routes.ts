import { Router } from "express";
import {
  getHomesForHomePage,
  getAllHomesByFilter,
  getHomeById,
  getAllHomesCountByFilter,
  CreateNewHome,
  updateHome,
  upload,
} from "../controllers/homes-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const homeRoutes = Router();

homeRoutes.get("/24homes", getHomesForHomePage);
homeRoutes.get("/filters", getAllHomesByFilter);
homeRoutes.get("/count", getAllHomesCountByFilter);
homeRoutes.get("/:homeId", getHomeById);
homeRoutes.post("/create", verifyToken, upload.array("image"), CreateNewHome);
homeRoutes.patch("/update/:homeId", verifyToken, updateHome);
