import User from "../models/user-model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middelware/auth-middelware";

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

export async function register(req: Request, res: Response) {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS); // Hash password
    const user = new User({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
    });
    await user.save(); // Save user to database

    res.status(201).json({ user });
  } catch (error: any) {
    console.error("Error during user registration:", error);

    if (error.code === 11000) {
      return res.status(400).json({ error: "User already exists" });
    }

    res
      .status(500)
      .json({ error: "Registration failed", details: error.message });
  }
}

export async function logIn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Log input details

    const user = await User.findOne({ email });
    ("User found");

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      ("password match failed");

      return res.status(401).json({ error: "Authentication failed" });
    }

    // Generate JWT token containing user id
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send token in response to the client, not the user object!
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(500).json({ error: "Login failed" });
  }
}

export async function getUserById(req: CustomRequest, res: Response) {
  const { userId } = req;
  userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userObject = user.toObject();
    const { password, ...userWithoutPassword } = userObject;

    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find();

    const usersWithoutPassword = users.map((user) => {
      const userObject = user.toObject();
      const { password, ...userWithoutPassword } = userObject;
      return userWithoutPassword;
    });

    res.status(200).json({ users: usersWithoutPassword });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
}
