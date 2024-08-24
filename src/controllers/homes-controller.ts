import { Request, Response } from "express";
import Home from "../models/home-model";
import makeCriteria from "../utils/criteria";

async function getHomesForHomePage(req: Request, res: Response) {
  try {
    const limit = 24;

    // Use aggregation to get random homes
    const homes = await Home.aggregate([{ $sample: { size: limit } }]);

    res.status(200).json(homes);
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

async function getAllHomesByFilter(req: Request, res: Response) {
  const { query } = req;
  const criteria = await makeCriteria(req.query);
  let page: number = Number(query.page) || 1;
  if (page < 1) page = 1;

  const limit: number = Number(query.limit) || 18;
  const startIndex = (page - 1) * limit || 0;

  try {
    // Validate query parameters if needed
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({
        error:
          "homes-controller, getAllHomesByFilter: Invalid page or limit parameter",
      });
    }

    const homes = await Home.find(criteria).skip(startIndex).limit(limit);

    // Check if any homes were found
    if (homes.length === 0) {
      return res.status(404).json({
        message: "homes-controller, getAllHomesByFilter: No homes found",
      });
    }

    res.status(200).json(homes);
  } catch (error: any) {
    console.error(
      "homes-controller, getAllHomesByFilter: Error fetching homes:",
      error
    );

    if (error.name === "ValidationError") {
      // Handle validation errors (e.g., malformed query criteria)
      return res.status(400).json({
        error: "homes-controller, getAllHomesByFilter: Invalid criteria",
      });
    }

    // Handle other potential errors
    res.status(500).json({
      error:
        "homes-controller, getAllHomesByFilter: Server error, please try again later",
    });
  }
}

export { getHomesForHomePage, getAllHomesByFilter };
