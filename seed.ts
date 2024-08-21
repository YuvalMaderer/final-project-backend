import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/user-model";

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

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

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
      {
        email: "alice.jones@example.com",
        password: hashedPassword,
        firstName: "Alice",
        lastName: "Jones",
        birthday: new Date("1988-03-03"),
        reviews: [],
        wishlists: [],
      },
      {
        email: "bob.brown@example.com",
        password: hashedPassword,
        firstName: "Bob",
        lastName: "Brown",
        birthday: new Date("1985-04-04"),
        reviews: [],
        wishlists: [],
      },
      {
        email: "charlie.white@example.com",
        password: hashedPassword,
        firstName: "Charlie",
        lastName: "White",
        birthday: new Date("1983-05-05"),
        reviews: [],
        wishlists: [],
      },
    ];

    // Insert users into the database
    await User.insertMany(users);
    console.log("Users seeded successfully!");
  } catch (err) {
    console.error("Error seeding users:", err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedUsers();
