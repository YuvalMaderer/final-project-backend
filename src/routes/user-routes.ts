import { Router } from "express";
import { addToWishlist, getUserWishlists, getWishlistByName, removeFromWishlist } from "../controllers/user-controller";

export const userRoutes = Router();

userRoutes.get("/getWishlist", getUserWishlists);
userRoutes.get("/getWishlistByName", getWishlistByName);
userRoutes.post("/addToWishlist", addToWishlist);
userRoutes.delete("/removeFromWishlist", removeFromWishlist);

