// config/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env vars

export async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in the environment variables");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(
      "MongoDB connection error:",
      err instanceof Error ? err.message : String(err)
    );
    process.exit(1); // Exit process with failure
  }
}
