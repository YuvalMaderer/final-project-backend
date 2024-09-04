import express, { Application, Express } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectDB } from "./config/db";
import { authRoutes } from "./routes/auth-routes";
import { homeRoutes } from "./routes/homes-routes";
import { reservationRoutes } from "./routes/reservation-routes";
import { userRoutes } from "./routes/user-routes";
import { uploadRoutes } from "./routes/image-route";
import chatRouter from "./routes/chat-router";
import notificationRoutes from './routes/notification-routes';
// import socketMiddleware from "./middelware/auth-req";
import { setupSocketIO } from "./socket"; // Import the Socket.IO setup

const PORT = process.env.PORT || 3000;

const app: Express = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for production to the correct origin
    methods: ["GET", "POST", "PATCH"],
  },
});

setupSocketIO(io); // Set up Socket.IO

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
  app.use("/api/images", uploadRoutes);
  app.use("/api/chat", chatRouter);
  app.use('/api/notification', notificationRoutes);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();
