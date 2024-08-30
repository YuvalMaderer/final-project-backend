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

const upload: Multer = multer({ dest: "uploads/" });

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

const uploadImage = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  try {
    const result = await cloudinaryV2.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Remove the file from the local storage after uploading to Cloudinary
    res.status(200).json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
