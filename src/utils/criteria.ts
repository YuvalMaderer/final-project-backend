export interface QueryFilter {
  types?: string;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  hostLanguage?: string[];
  amenities?: string[];
  capacity?: number;
  location?: string[]; // Array of possible locations
}

// Define the criteria function
function criteria(query: QueryFilter): Record<string, any> {
  const res: Record<string, any> = {};

  // Type
  if (query.types) {
    res.types = { $regex: query.types, $options: "i" };
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
  if (query.hostLanguage && query.hostLanguage.length > 0) {
    res.hostLanguage = { $in: query.hostLanguage };
  }

  // Amenities
  if (query.amenities && query.amenities.length > 0) {
    res.amenities = { $all: query.amenities };
  }

  // Location
  if (query.location) {
    const locationRegex = { $regex: query.location, $options: "i" };
    res.$or = [
      { "loc.country": locationRegex },
      { "loc.city": locationRegex },
      { "loc.address": locationRegex },
    ];
  }

  return res;
}

export default criteria;
