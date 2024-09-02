import { Request, Response } from "express";
import User, { IUser } from "../models/user-model";

async function addToWishlist(req: Request, res: Response) {
  try {
    const { title, homeId, userId } = req.body;

    if (!title || !homeId || !userId) {
      return res.status(400).json({
        error:
          "user-controller addToWishlist: All required fields must be provided",
      });
    }

    // Check if the user exists and populate their wishlists
    const user: IUser | null = await User.findById(userId).populate("wishlists");
    if (!user) {
      return res.status(404).json({
        error: "user-controller addToWishlist: User not found",
      });
    }

    // Find the wishlist by title
    let wishlist = user.wishlists.find(wl => wl.title === title);

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = { title, list: [homeId] };
      user.wishlists.push(wishlist);
    } else {
      // Add homeId to the wishlist if it's not already present
      if (!wishlist.list.includes(homeId)) {
        wishlist.list.push(homeId);
        // Mark the wishlists array as modified
        user.markModified('wishlists');
      } else {
        return res.status(400).json({
          error: "user-controller addToWishlist: Home is already in the wishlist",
        });
      }
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Home added to wishlist successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: `user-controller addToWishlist: ${error.message}`,
    });
  }
}

import { Types } from 'mongoose';

async function removeFromWishlist(req: Request, res: Response): Promise<Response> {
  try {
    const { title, homeId, userId } = req.body;

    // Validate input
    if (!title || !homeId || !userId) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

    // Check if userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user ID format",
      });
    }

    // Find user and populate wishlists
    const user: IUser | null = await User.findById(userId).populate("wishlists");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Find wishlist by title
    const wishlistIndex = user.wishlists.findIndex(wl => wl.title === title);
    if (wishlistIndex === -1) {
      return res.status(404).json({
        error: "Wishlist not found",
      });
    }

    const wishlist = user.wishlists[wishlistIndex];

    // Remove homeId from the wishlist
    const homeIndex = wishlist.list.indexOf(homeId);
    if (homeIndex === -1) {
      return res.status(400).json({
        error: "Home is not in the wishlist",
      });
    }

    // Remove the item
    wishlist.list.splice(homeIndex, 1);

    // Check if wishlist is now empty and delete if so
    if (wishlist.list.length === 0) {
      user.wishlists.splice(wishlistIndex, 1);
    } else {
      // Mark as modified if wishlist is not empty
      user.markModified('wishlists');
    }

    // Save user changes
    await user.save();

    return res.status(200).json({
      message: "Home removed from wishlist successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
}

export default removeFromWishlist;


  async function getUserWishlists(req: Request, res: Response) {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({
          error: "user-controller getUserWishlists: userId must be provided",
        });
      }
  
      // Check if the user exists and populate their wishlists
      const user: IUser | null = await User.findById(userId).populate("wishlists");
      if (!user) {
        return res.status(404).json({
          error: "user-controller getUserWishlists: User not found",
        });
      }
  
      // Return the user's wishlists
      return res.status(200).json({
        wishlists: user.wishlists,
      });
    } catch (error: any) {
      return res.status(500).json({
        error: `user-controller getUserWishlists: ${error.message}`,
      });
    }
  }

  async function getWishlistByName(req: Request, res: Response) {
    const { userId, title } = req.query;

    try {
      const user: IUser | null = await User.findById(userId).populate("wishlists");
      if (!user) {
        throw new Error("User not found");
      }
      
      const wishlist = user.wishlists.find(wl => wl.title === title);
      if (!wishlist) {
        throw new Error("Wishlist not found");
      }
      
      return res.status(200).json({
        wishlist,
      });
    } catch (error: any) {
      throw new Error(`getWishlistByName: ${error.message}`);
    }
  }

  export { addToWishlist, removeFromWishlist, getUserWishlists, getWishlistByName };
