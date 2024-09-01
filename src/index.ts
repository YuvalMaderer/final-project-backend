import express, { Application, Express } from "express";

import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth-routes";
import { homeRoutes } from "./routes/homes-routes";
import { reservationRoutes } from "./routes/reservation-routes";
import { userRoutes } from "./routes/user-routes";
// import socketMiddleware from "./middelware/auth-req";

const PORT = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for production to the correct origin
    methods: ["GET", "POST", "PATCH"],
  },
});

async function main() {
  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(cors()); // Configure CORS properly for production

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/homes", homeRoutes);
  app.use("/api/reservation", reservationRoutes);
  app.use("/api/user", userRoutes);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
