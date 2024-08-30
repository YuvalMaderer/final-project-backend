import { Request, Response } from "express";
import Home from "../models/home-model";
import makeCriteria from "../utils/criteria";
import { CustomRequest } from "../middelware/auth-middelware";
import { v2 as cloudinaryV2 } from "cloudinary";
import multer, { Multer } from "multer";
import fs from "fs";


cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload: Multer = multer({ dest: "uploads/" });


//////////////////////// Get random 24 homes ////////////////////////
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

//////////////////////// Get home by Filters ////////////////////////
async function getAllHomesByFilter(req: Request, res: Response) {
  const { query } = req;
  console.log(query);
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
//////////////////////// Get homes count by Filters ////////////////////////
async function getAllHomesCountByFilter(req: Request, res: Response) {
  const { query } = req;
  const criteria = await makeCriteria(req.query);

  try {
    const homesCount = await Home.countDocuments(criteria);

    res.status(200).json(homesCount);
  } catch (error: any) {
    console.error(
      "homes-controller, getAllHomesCountByFilter: Error fetching homes:",
      error
    );

    if (error.name === "ValidationError") {
      // Handle validation errors (e.g., malformed query criteria)
      return res.status(400).json({
        error: "homes-controller, getAllHomesCountByFilter: Invalid criteria",
      });
    }

    // Handle other potential errors
    res.status(500).json({
      error:
        "homes-controller, getAllHomesCountByFilter: Server error, please try again later",
    });
  }
}

//////////////////////// Get home by ID ////////////////////////
async function getHomeById(req: Request, res: Response) {
  const { homeId } = req.params;
  try {
    const home = await Home.findById(homeId);
    // Check if any homes were found
    if (!home) {
      return res.status(404).json({
        message: "homes-controller, getHomeById: No home found",
      });
    }

    res.status(200).json(home);
  } catch (error: any) {
    console.error(
      "homes-controller, getHomeById: Error fetching homes:",
      error
    );

    if (error.name === "ValidationError") {
      // Handle validation errors (e.g., malformed query criteria)
      return res.status(400).json({
        error: "homes-controller, getHomeById: Invalid criteria",
      });
    }

    // Handle other potential errors
    res.status(500).json({
      error:
        "homes-controller, getHomeById: Server error, please try again later",
    });
  }
}

//////////////////////// Create new home ////////////////////////
async function CreateNewHome(req: Request, res: Response) {
  try {
    const {
      name,
      type,
      capacity,
      imgUrls,
      price,
      summary,
      amenities,
      bathrooms,
      bedrooms,
      beds,
      roomType,
      host,
      loc,
      bookingOptions,
      accessibility,
    } = req.body;

    if (
      !name ||
      !type ||
      !capacity ||
      !imgUrls ||
      !price ||
      !summary ||
      !amenities ||
      !bathrooms ||
      !bedrooms ||
      !beds ||
      !roomType ||
      !host ||
      !loc ||
      !bookingOptions ||
      !accessibility
    ) {
      return res.status(400).json({
        error:
          "homes-controller CreateNewHome: All required fields must be provided",
      });
    }

    // Assuming imgUrls is an array of file paths to be uploaded to Cloudinary
    const uploadedImages = await Promise.all(
      imgUrls.map(async (url: string) => {
        const result = await cloudinaryV2.uploader.upload(url);
        fs.unlinkSync(url); // Remove the file from the local storage after uploading to Cloudinary
        return result.secure_url;
      })
    );

    const newHome = new Home({
      name,
      type,
      capacity,
      imgUrls: uploadedImages, // Array of Cloudinary URLs
      price,
      summary,
      amenities,
      bathrooms,
      bedrooms,
      beds,
      roomType,
      host,
      loc,
      bookingOptions,
      accessibility,
    });

    // Save the new home to the database
    const savedHome = await newHome.save();

    console.log("homes-controller CreateNewHome: created successfully");
    return res.status(201).json(savedHome);
  } catch (err: any) {
    console.error(`homes-controller CreateNewHome: ${err.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

//////////////////////// Update home ////////////////////////
async function updateHome(req: CustomRequest, res: Response) {
  const { userId } = req;
  const { homeId } = req.params;
  const updatedHome  = req.body;
console.log(updatedHome);

  try {
    // Check if the home exists
    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({
        error: "homes-controller updateHome: Home not found",
      });
    }

    // Check if the user is the owner of the home
    if (home.host._id.toString() !== userId) {
      return res.status(403).json({
        error:
          "homes-controller updateHome: Unauthorized - You do not own this home",
      });
    }

    // Update the home
    const updated = await Home.findOneAndUpdate(
      { _id: homeId, "host._id": userId }, // Ensure the correct home and ownership
      updatedHome, // The updates
      { new: true } // Return the updated document
    );

    if (!updated) {
      return res.status(500).json({
        error: "homes-controller updateHome: Failed to update home",
      });
    }

    // Return the updated home
    return res.status(200).json(updated);
  } catch (error: any) {
    console.error(`homes-controller updateHome: ${error.message}`);
    return res.status(500).json({
      error: "homes-controller updateHome: An unexpected error occurred",
    });
  }
}

export {
  getHomesForHomePage,
  getAllHomesByFilter,
  getHomeById,
  getAllHomesCountByFilter,
  CreateNewHome,
  updateHome,
};
