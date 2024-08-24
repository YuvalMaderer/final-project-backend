import { Router } from "express";
import checkDateAvailability from "../middelware/reservation-middelware";
import {
  createNewReservation,
  deleteReservation,
  getAllHomeReservations,
  getAllUserReservations,
  updateReservationStatus,
} from "../controllers/reservation-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const reservationRoutes = Router();

reservationRoutes.get("/", verifyToken, getAllUserReservations);
reservationRoutes.get("/:homeId", verifyToken, getAllHomeReservations);
reservationRoutes.post(
  "/create",
  verifyToken,
  checkDateAvailability,
  createNewReservation
);
reservationRoutes.patch(
  "/updateStatus/:reservationId",
  verifyToken,
  updateReservationStatus
);
reservationRoutes.delete(
  "/delete/:reservationId",
  verifyToken,
  deleteReservation
);
