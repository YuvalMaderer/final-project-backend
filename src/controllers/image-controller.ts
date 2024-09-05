import { Request, Response } from "express";
import multer, { Multer } from "multer";
import { v2 as cloudinaryV2 } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

console.log(process.env.CLOUD_NAME);

const upload: Multer = multer({ dest: "uploads/" });

export interface MulterRequest extends Request {
  files: Express.Multer.File[]; // Changed from `file` to `files`
}

const uploadImage = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  try {
    const fileUploadPromises = req.files.map(async (file) => {
      const result = await cloudinaryV2.uploader.upload(file.path);
      fs.unlinkSync(file.path); // Remove the file from the local storage after uploading to Cloudinary
      return result.secure_url;
    });

    // Wait for all file uploads to complete
    const imageUrls = await Promise.all(fileUploadPromises);

    res.status(200).json({ success: true, imageUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// Export your middleware and handler
export { upload, uploadImage };
