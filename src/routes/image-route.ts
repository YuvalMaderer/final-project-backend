import { Router, Request, Response, RequestHandler } from "express";
import { MulterRequest, upload, uploadImage } from "../controllers/image-controller";

// Create an instance of Router
export const uploadRoutes = Router();

// Define the route for handling multiple file uploads
uploadRoutes.post(
  "/upload",
  upload.array('images') as RequestHandler, // Assert the type here
  (req: Request, res: Response) => uploadImage(req as MulterRequest, res) // Cast request to MulterRequest
);
