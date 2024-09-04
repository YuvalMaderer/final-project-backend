import Reservation from "../models/reservation-model";

import { Request, Response } from "express";
import Home from "../models/home-model"; // Adjust the path as needed
import User from "../models/user-model"; // Adjust the path as needed
import { CustomRequest } from "../middelware/auth-middelware";

//////////////////////// Create a new reservation ////////////////////////
async function createNewReservation(req: Request, res: Response) {
  try {
    const { user, home, startDate, endDate, totalPrice } = req.body;

    // Validate that all required fields are present
    if (!user || !home || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        error:
          "reservation-controller createNewReservation: All required fields must be provided",
      });
    }

    // Validate that startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        error:
          "reservation-controller createNewReservation: Start date must be before end date",
      });
    }

    // Check if the home exists and populate the host
    const homeDoc = await Home.findById(home).populate("host");
    if (!homeDoc) {
      return res.status(404).json({
        error: "reservation-controller createNewReservation: Home not found",
      });
    }

    // Extract the host from the home document
    const host = homeDoc.host;

    // Check if the user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({
        error: "reservation-controller createNewReservation: User not found",
      });
    }

    // Create the reservation with the host included
    const reservation = new Reservation({
      user,
      host, // Automatically set the host to the home’s host
      home,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice,
      status: "pending", // Default to 'pending'
    });

    await reservation.save();

    // Respond with the created reservation
    res.status(201).json({
      message:
        "reservation-controller createNewReservation: Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error(
      "reservation-controller createNewReservation: Error creating reservation:",
      error
    );
    res.status(500).json({
      error:
        "reservation-controller createNewReservation: Server error while creating reservation",
    });
  }
}

//////////////////////// Getting all user Reservations ////////////////////////
async function getAllUserReservations(req: CustomRequest, res: Response) {
  const { userId } = req;

  try {
    const userReservations = await Reservation.find({ user: userId }).populate({
      path: "home",
      populate: {
        path: "host",
        select: "fullName", // Select the host's full name from the host document
      },
      select: "name", // Select the home name from the home document
    });

    if (!userReservations || userReservations.length === 0) {
      return res.status(404).json({
        error:
          "reservation-controller getAllUserReservations: No reservations found for this user.",
      });
    }

    res.status(200).json(userReservations);
  } catch (error) {
    console.error(
      "reservation-controller getAllUserReservations: Error fetching user reservations:",
      error
    );
    res.status(500).json({
      error:
        "reservation-controller getAllUserReservations: Internal server error",
    });
  }
}
//////////////////////// Getting all host Reservations ////////////////////////
async function getAllHostReservations(req: CustomRequest, res: Response) {
  const { userId } = req;

  try {
    const hostReservations = await Reservation.find({ host: userId })
      .populate({
        path: "user",
        select: "firstName lastName", // Select only the firstName from the user document
      })
      .populate({
        path: "home",
        select: "name", // Select only the home name from the home document
      });

    if (!hostReservations || hostReservations.length === 0) {
      return res.status(404).json({
        error:
          "reservation-controller getAllHostReservations: No reservations found for this host.",
      });
    }

    res.status(200).json(hostReservations);
  } catch (error) {
    console.error(
      "reservation-controller getAllHostReservations: Error fetching host reservations:",
      error
    );
    res.status(500).json({
      error:
        "reservation-controller getAllHostReservations: Internal server error",
    });
  }
}

//////////////////////// Get all Reservations for home ////////////////////////
async function getAllHomeReservations(req: CustomRequest, res: Response) {
  const { homeId } = req.params;

  try {
    const homeReservations = await Reservation.find({ home: homeId });

    if (!homeReservations || homeReservations.length === 0) {
      return res.status(404).json({
        error:
          "reservation-controller getAllHomeReservations: No reservations found for this home.",
      });
    }

    res.status(200).json(homeReservations);
  } catch (error) {
    console.error(
      "reservation-controller getAllHomeReservations: Error fetching home reservations:",
      error
    );
    res.status(500).json({
      error:
        "reservation-controller getAllHomeReservations: Internal server error",
    });
  }
}

////////////////////////Update the Reservation Status ////////////////////////
async function updateReservationStatus(req: CustomRequest, res: Response) {
  const { userId } = req;
  const { reservationId } = req.params;
  const { status } = req.body;

  try {
    // Find the reservation by ID
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        error:
          "reservation-controller updateReservationStatus: Reservation not found",
      });
    }

    // Find the listing associated with the reservation
    const listing = await Home.findById(reservation.home);

    if (!listing) {
      return res.status(404).json({
        error: "reservation-controller updateReservationStatus: Home not found",
      });
    }

    // Check if the user is the host of the listing
    if (listing.host._id.toString() !== userId) {
      return res.status(403).json({
        error:
          "reservation-controller updateReservationStatus: You are not authorized to change the status of this reservation",
      });
    }

    // Update the reservation status
    reservation.status = status;
    await reservation.save();

    res.status(200).json(reservation);
  } catch (error) {
    console.error(
      "reservation-controller updateReservationStatus: Error updating reservation status:",
      error
    );
    res.status(500).json({
      error:
        "reservation-controller updateReservationStatus: Internal server error",
    });
  }
}

//////////////////////// Delete Reservation //////////////////////////
async function deleteReservation(req: CustomRequest, res: Response) {
  const { userId } = req;
  const { reservationId } = req.params;

  try {
    // Find the reservation by ID
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        error:
          "reservation-controller deleteReservation: Reservation not found",
      });
    }

    // Check if the user is either the guest (user) or the host
    if (
      reservation.user.toString() !== userId &&
      reservation.host.toString() !== userId
    ) {
      return res.status(403).json({
        error:
          "reservation-controller deleteReservation: You are not authorized to delete this reservation",
      });
    }

    // Delete the reservation
    await Reservation.findByIdAndDelete(reservationId);

    res.status(200).json({
      message:
        "reservation-controller deleteReservation: Reservation deleted successfully",
    });
  } catch (error) {
    console.error(
      "reservation-controller deleteReservation: Error deleting reservation:",
      error
    );
    res.status(500).json({
      error: "reservation-controller deleteReservation: Internal server error",
    });
  }
}

export {
  createNewReservation,
  getAllUserReservations,
  getAllHostReservations,
  getAllHomeReservations,
  updateReservationStatus,
  deleteReservation,
};
