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
  location?: string; // Single location
}

// Define the criteria function
function makeCriteria(query: QueryFilter): Record<string, any> {
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
    res.bedrooms = query.bedrooms;
  }

  // Beds
  if (query.beds !== undefined) {
    res.beds = query.beds;
  }

  // Bathrooms
  if (query.bathrooms !== undefined) {
    res.bathrooms = query.bathrooms;
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
    res.amenities = { $in: amenities };
  }

  // Location
  if (query.location) {
    res.$or = [
      { "loc.country": { $regex: query.location, $options: "i" } },
      { "loc.city": { $regex: query.location, $options: "i" } },
      { "loc.address": { $regex: query.location, $options: "i" } },
    ];
  }

  console.log("Generated criteria:", JSON.stringify(res, null, 2)); // Additional debugging output

  return res;
}

export default makeCriteria;
