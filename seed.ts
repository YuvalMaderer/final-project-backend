import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/user-model";
import Home from "./src/models/home-model";
import Reservation from "./src/models/reservation-model";
import { homes } from "./homes"; // Assuming homes.ts exports an array of homes

dotenv.config(); // Load environment variables from .env file

const mongoUri = process.env.MONGO_URI;
console.log(mongoUri)

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

const seedUsersHomesReservations = async () => {
  try {
    // Clear existing users, homes, and reservations
    await User.deleteMany({});
    await Home.deleteMany({});
    await Reservation.deleteMany({}); 

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
    ];

    // Insert users into the database
    const insertedUsers = await User.insertMany(users);
    console.log("Users seeded successfully!");

    // Insert homes into the database
    const insertedHomes = await Home.insertMany(homes);
    console.log("Homes seeded successfully!");

    // Hardcoded Reservations
    const reservations = [
      {
        user: insertedUsers[0]._id, // John Doe
        host: insertedHomes[0].host, // Host from the first home
        home: insertedHomes[0]._id, // First home
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-09-06"),
        totalPrice: insertedHomes[0].price * 5,
        status: "confirmed",
      },
      {
        user: insertedUsers[1]._id, // Jane Smith
        host: insertedHomes[1].host, // Host from the second home
        home: insertedHomes[1]._id, // Second home
        startDate: new Date("2024-09-10"),
        endDate: new Date("2024-09-15"),
        totalPrice: insertedHomes[1].price * 5,
        status: "confirmed",
      },
      {
        user: insertedUsers[0]._id, // John Doe
        host: insertedHomes[1].host, // Host from the second home
        home: insertedHomes[1]._id, // Second home
        startDate: new Date("2024-10-01"),
        endDate: new Date("2024-10-06"),
        totalPrice: insertedHomes[1].price * 5,
        status: "pending",
      },
      {
        user: insertedUsers[1]._id, // Jane Smith
        host: insertedHomes[0].host, // Host from the first home
        home: insertedHomes[0]._id, // First home
        startDate: new Date("2024-11-01"),
        endDate: new Date("2024-11-06"),
        totalPrice: insertedHomes[0].price * 5,
        status: "cancelled",
      },
      {
        user: insertedUsers[0]._id, // John Doe
        host: insertedHomes[0].host, // Host from the first home
        home: insertedHomes[0]._id, // First home
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-06"),
        totalPrice: insertedHomes[0].price * 5,
        status: "confirmed",
      },
    ];

    // Insert reservations into the database
    await Reservation.insertMany(reservations);
    console.log("Reservations seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedUsersHomesReservations();
