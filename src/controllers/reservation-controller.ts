import Reservation from "../models/reservation-model";

import { Request, Response } from "express";
import Home from "../models/home-model"; // Adjust the path as needed
import User from "../models/user-model"; // Adjust the path as needed
import { CustomRequest } from "../middelware/auth-middelware";


// Create a new reservation
async function createNewReservation(req: Request, res: Response) {
  try {
    const { user, home, startDate, endDate, totalPrice } = req.body;

    // Validate that all required fields are present
    if (!user || !home || !startDate || !endDate || !totalPrice) {
      return res
        .status(400)
        .json({
          error:
            "reservation-controller createNewReservation: All required fields must be provided",
        });
    }

    // Validate that startDate is before endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({
          error:
            "reservation-controller createNewReservation: Start date must be before end date",
        });
    }

    // Check if the home exists and populate the host
    const homeDoc = await Home.findById(home).populate("host");
    if (!homeDoc) {
      return res
        .status(404)
        .json({
          error: "reservation-controller createNewReservation: Home not found",
        });
    }

    // Extract the host from the home document
    const host = homeDoc.host;

    // Check if the user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res
        .status(404)
        .json({
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
    res
      .status(500)
      .json({
        error:
          "reservation-controller createNewReservation: Server error while creating reservation",
      });
  }
}

// Getting all user Reservations
async function getAllUserReservations(req: CustomRequest, res: Response) {
  const { userId } = req;

  try {
    const userReservation = await Reservation.find({ user: userId });

    if (!userReservation || userReservation.length === 0) {
      return res
        .status(404)
        .json({ error: "No reservations found for this user." });
    }

    res.status(200).json(userReservation);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { createNewReservation, getAllUserReservations };
