 import { Schema, model, Document, Types } from "mongoose";

// Define an interface representing a document in MongoDB.
export interface IReservation extends Document {
  user: Types.ObjectId;
  host: Types.ObjectId;
  home: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

// Create a Schema corresponding to the document interface.
const ReservationSchema = new Schema<IReservation>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    home: { type: Schema.Types.ObjectId, ref: "Home", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Create a Model.
const Reservation = model<IReservation>("Reservation", ReservationSchema);

export default Reservation;
