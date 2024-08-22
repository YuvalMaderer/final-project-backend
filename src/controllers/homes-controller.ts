import { Request, Response } from "express";
import Home from "../models/home-model";

async function getHomesForHomePage(req: Request, res: Response) {
  try {
    const limit = 24;

    // Use aggregation to get random homes
    const homes = await Home.aggregate([{ $sample: { size: limit } }]);

    res.json(homes);
  } catch (error) {
    console.error(
      "homes-controller getHomesForHomePage : Error fetching homes",
      error
    );
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        res.status(400).json({
          message: "homes-controller getHomesForHomePage : Validation error",
          error: error.message,
        });
      } else {
        res.status(500).json({
          message:
            "homes-controller getHomesForHomePage : An unexpected error occurred",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({
        message:
          "homes-controller getHomesForHomePage : An unknown error occurred",
      });
    }
  }
}

export { getHomesForHomePage };
