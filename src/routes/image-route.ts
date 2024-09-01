import { Router } from "express";
import { upload, uploadImage } from "../controllers/image-controller";

// Create an instance of Router
export const uploadRoutes = Router();

// Define the route for handling multiple file uploads
uploadRoutes.post("/upload", upload.array('images'), uploadImage);
