import { Router } from "express";
import checkDateAvailability from "../middelware/reservation-middelware";
import {
  createNewReservation,
  deleteReservation,
  getAllHomeReservations,
  getAllHostReservations,
  getAllUserReservations,
  updateReservationStatus,
} from "../controllers/reservation-controller";
import { verifyToken } from "../middelware/auth-middelware";

export const reservationRoutes = Router();

reservationRoutes.get("/user", verifyToken, getAllUserReservations);
reservationRoutes.get("/host", verifyToken, getAllHostReservations);
reservationRoutes.get("/:homeId", getAllHomeReservations);
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
