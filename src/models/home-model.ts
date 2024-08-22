import mongoose, { Schema, model, Document } from "mongoose";

interface IReview {
  at: string | Date;
  by: { id: string; fullname: string; imgUrl: string };
  txt: string;
  rate: {
    Cleanliness: number;
    Communication: number;
    "Check-in": number;
    Accuracy: number;
    location: number;
    value: number;
  };
}

interface ILocation {
  country: string;
  countryCode: string;
  city: string;
  address: string;
  lat: number;
  lan: number;
}

interface IHost {
  _id: string;
  fullname: string;
  location: string;
  about: string;
  thumbnailUrl: string;
  imgUrl: string;
  isSuperhost: boolean;
}

interface IHome extends Document {
  name: string;
  type: string;
  imgUrls: string[];
  price: number;
  summery: string;
  amenities: string[];
  bathrooms: number;
  bedrooms: number;
  roomType: string;
  host: IHost;
  location: ILocation;
  reviews: IReview[];
  likedByUsers: string[];
}

const reviewSchema = new Schema({
  at: {
    type: Date,
    required: true,
  },
  by: {
    _id: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
    },
  },
  txt: {
    type: String,
  },
  rate: {
    Cleanliness: { type: Number, required: true },
    Communication: { type: Number, required: true },
    "Check-in": { type: Number, required: true },
    Accuracy: { type: Number, required: true },
    Location: { type: Number, required: true },
    Value: { type: Number, required: true },
  },
});

const locationSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lan: {
    type: Number,
    required: true,
  },
});

const hostSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  about: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  isSuperhost: {
    type: Boolean,
  },
});

const homeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  imgUrls: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  host: {
    type: hostSchema,
    required: true,
  },
  loc: {
    type: locationSchema,
    required: true,
  },
  reviews: [reviewSchema],
  likedByUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

const Home = mongoose.model<IHome>("Home", homeSchema);

export default Home;
