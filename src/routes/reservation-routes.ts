import { Router } from "express";
import checkDateAvailability from "../middelware/reservation-middelware";
import {
  createNewReservation,
  getAllUserReservations,
} from "../controllers/reservation-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const reservationRoutes = Router();

reservationRoutes.get("/", verifyToken, getAllUserReservations);
reservationRoutes.post(
  "/create",
  verifyToken,
  checkDateAvailability,
  createNewReservation
);
