import Reservation from "../models/reservation-model";

export interface QueryFilter {
  type?: string;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  hostLanguage?: string | string[];
  amenities?: string | string[];
  capacity?: number;
  accessibility?: string | string[];
  bookingOptions?: {
    InstantBook?: boolean;
    SelfCheckIn?: boolean;
    AllowsPets?: boolean;
  };
  location?: string; // Single location
  startDate?: Date;
  endDate?: Date;
}

// Define the criteria function

async function makeCriteria(query: QueryFilter): Promise<Record<string, any>> {
  const res: Record<string, any> = {};

  // Type
  if (query.type) {
    res.type = { $regex: query.type, $options: "i" };
  }

  // Room Type
  if (query.roomType) {
    res.roomType = { $regex: query.roomType, $options: "i" };
  }

  // Price Range
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    res.price = {};
    if (query.minPrice !== undefined) {
      res.price.$gte = query.minPrice;
    }
    if (query.maxPrice !== undefined) {
      res.price.$lte = query.maxPrice;
    }
  }

  // Bedrooms
  if (query.bedrooms !== undefined) {
    res.bedrooms = Number(query.bedrooms);
  }

  // Beds
  if (query.beds !== undefined) {
    res.beds = Number(query.beds);
  }

  // Bathrooms
  if (query.bathrooms !== undefined) {
    res.bathrooms = Number(query.bathrooms);
  }

  // Capacity
  if (query.capacity !== undefined) {
    res.capacity = { $gte: query.capacity };
  }

  // Host Language
  if (query.hostLanguage) {
    const languages = Array.isArray(query.hostLanguage)
      ? query.hostLanguage
      : query.hostLanguage.split(","); // Correctly split by comma
    res["host.language"] = { $in: languages };
  }

  // Amenities
  if (query.amenities) {
    const amenities = Array.isArray(query.amenities)
      ? query.amenities
      : query.amenities.split(","); // Correctly split by comma
  
    res.amenities = { $all: amenities };
  }

  // Accessibility
  if (query.accessibility) {
    const accessibility = Array.isArray(query.accessibility)
      ? query.accessibility
      : query.accessibility.split(","); // Correctly split by comma
    res.accessibility = { $in: accessibility };
  }

  // Booking Options
  if (query.bookingOptions) {
    if (query.bookingOptions.InstantBook !== undefined) {
      res["bookingOptions.InstantBook"] = query.bookingOptions.InstantBook;
    }
    if (query.bookingOptions.SelfCheckIn !== undefined) {
      res["bookingOptions.SelfCheckIn"] = query.bookingOptions.SelfCheckIn;
    }
    if (query.bookingOptions.AllowsPets !== undefined) {
      res["bookingOptions.AllowsPets"] = query.bookingOptions.AllowsPets;
    }
  }

  // Location
  if (query.location) {
    res.$or = [
      { "loc.country": { $regex: query.location, $options: "i" } },
      { "loc.city": { $regex: query.location, $options: "i" } },
      { "loc.address": { $regex: query.location, $options: "i" } },
    ];
  }

  // Date Availability
  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    // Find homes that have no conflicting reservations
    const reservedHomeIds = await Reservation.find({
      $or: [
        { startDate: { $lt: endDate, $gte: startDate } },
        { endDate: { $gt: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
      ],
    }).distinct("home");

    // Exclude homes that are already reserved
    res._id = { $nin: reservedHomeIds };
  }

  console.log("Generated criteria:", JSON.stringify(res, null, 2)); // Additional debugging output

  return res;
}

export default makeCriteria;
