import { Request, Response, NextFunction } from "express";
import Reservation from "../models/reservation-model";

const checkDateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { home, startDate, endDate } = req.body;

  try {
    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Query to check for overlapping reservations
    const conflictingReservations = await Reservation.find({
      home: home,
      $or: [
        { startDate: { $lt: end, $gte: start } },
        { endDate: { $gt: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } },
      ],
    });

    if (conflictingReservations.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "reservation-middelware checkDateAvailability: The selected dates are already taken",
        });
    }

    // If no conflicts, proceed to the next middleware/route handler
    next();
  } catch (error) {
    return res
      .status(500)
      .json({
        error:
          " reservation-middelware checkDateAvailability: Error checking date availability",
      });
  }
};

export default checkDateAvailability;
