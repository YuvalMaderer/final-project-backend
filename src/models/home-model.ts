import mongoose, { Schema, model, Document } from "mongoose";

export interface IRating {
  Cleanliness: number;
  Communication: number;
  "Check-in": number;
  Accuracy: number;
  Location: number;
  Value: number;
}

export interface IReview {
  at: string | Date;
  by: { id: string; fullname: string; imgUrl: string };
  txt: string;
  rate: IRating;
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
  language: string[];
  _id: mongoose.Schema.Types.ObjectId;
  fullname: string;
  location: string;
  about?: string;
  thumbnailUrl?: string;
  imgUrl?: string;
  isSuperhost: boolean;
}

interface IHome extends Document {
  name: string;
  type: string;
  capacity: number;
  imgUrls: string[];
  price: number;
  summary: string;
  amenities: string[];
  bathrooms: number;
  bedrooms: number;
  beds: number;
  roomType: string;
  host: IHost;
  loc: ILocation;
  reviews: IReview[];
  likedByUsers: mongoose.Schema.Types.ObjectId[];
  bookingOptions: {
    InstantBook: boolean;
    SelfCheckIn: boolean;
    AllowsPets: boolean;
  };
  accessibility: string[];
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

const locationSchema = new Schema<ILocation>({
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

const hostSchema = new Schema<IHost>({
  language: { type: [String], require: true },
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
  },
  isSuperhost: {
    type: Boolean,
  },
});

const homeSchema = new Schema<IHome>({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  capacity: { type: Number, require: true },
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
    default:[]
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  beds: {
    type: Number,
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
  bookingOptions: {
    InstantBook: { type: Boolean, required: true },
    SelfCheckIn: { type: Boolean, required: true },
    AllowsPets: { type: Boolean, required: true },
  },
  accessibility: { type: [String], default: [] },
});

const Home = mongoose.model<IHome>("Home", homeSchema);

export default Home;
