import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { server } from "typescript";
import { Server } from "socket.io";

const { JWT_SECRET } = process.env;

//interface
export interface CustomRequest extends Request {
  userId?: string; // or number, depending on your userId type
  homeId?: string;
}

export interface JwtPayload {
  userId: string;
  // Add any other properties that your JWT payload might have
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Split the token from the header (Bearer token)
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"]; // Get the authorization header

  let token: string | undefined;
  if (typeof authHeader === "string") {
    token = authHeader && authHeader.split(" ")[1]; // Get the token from the header
  }
  if (!token) {
    console.log("auth.middleware, verifyToken. No token provided");
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as CustomRequest).userId = decoded.userId; // Add userId to request object
    next(); // Call next middleware
  } catch (error) {
    console.log(
      "auth.middleware, verifyToken. Error while verifying token",
      error
    );
    res.status(401).json({ error: "Invalid token" });
  }
}
