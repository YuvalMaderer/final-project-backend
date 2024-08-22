import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/user-model";
import Home from "./src/models/home-model"; // Assuming you've saved the Home schema in home-model.js
import { homes } from "./homes";

dotenv.config(); // Load environment variables from .env file

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

// Connect to MongoDB
mongoose
  .connect(mongoUri)
  .then(() => console.log("Database connected!"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

const seedUsersAndHomes = async () => {
  try {
    // Clear existing users and homes
    await User.deleteMany({});
    await Home.deleteMany({});

    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create an array of users
    const users = [
      {
        email: "john.doe@example.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        birthday: new Date("1990-01-01"),
        reviews: [],
        wishlists: [],
      },
      {
        email: "jane.smith@example.com",
        password: hashedPassword,
        firstName: "Jane",
        lastName: "Smith",
        birthday: new Date("1992-02-02"),
        reviews: [],
        wishlists: [],
      },
      // Add more users as needed...
    ];

    // Insert users into the database
    await User.insertMany(users);
    console.log("Users seeded successfully!");

    // Insert homes into the database
    await Home.insertMany(homes);
    console.log("Homes seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedUsersAndHomes();
