import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  // reviews: string[];
  wishlists: IWhishlist[];
  picture?: string;
  phoneNumber?: string;
}

interface IWhishlist {
  title: string;
  list: string[];
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthday: { type: Date, required: true },
  picture: { type: String },
  phoneNumber: { type: String },
  wishlists: { type: [Object], default: [] },
});

const User = model<IUser>("User", userSchema);
export default User;
