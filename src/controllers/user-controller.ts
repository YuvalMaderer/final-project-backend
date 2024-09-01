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

async function removeFromWishlist(req: Request, res: Response) {
    try {
      const { title, homeId, userId } = req.body;
  
      if (!title || !homeId || !userId) {
        return res.status(400).json({
          error:
            "user-controller removeFromWishlist: All required fields must be provided",
        });
      }
  
      // Check if the user exists and populate their wishlists
      const user: IUser | null = await User.findById(userId).populate("wishlists");
      if (!user) {
        return res.status(404).json({
          error: "user-controller removeFromWishlist: User not found",
        });
      }
  
      // Find the wishlist by title
      const wishlist = user.wishlists.find(wl => wl.title === title);
      if (!wishlist) {
        return res.status(404).json({
          error: "user-controller removeFromWishlist: Wishlist not found",
        });
      }
  
      // Check if the homeId exists in the wishlist
      const homeIndex = wishlist.list.indexOf(homeId);
      if (homeIndex === -1) {
        return res.status(400).json({
          error: "user-controller removeFromWishlist: Home is not in the wishlist",
        });
      }
  
      // Remove the homeId from the wishlist
      wishlist.list.splice(homeIndex, 1);
  
      // Mark the wishlists array as modified
      user.markModified('wishlists');
  
      // Save the updated user document
      await user.save();
  
      return res.status(200).json({
        message: "Home removed from wishlist successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        error: `user-controller removeFromWishlist: ${error.message}`,
      });
    }
  }

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
    const { title } = req.body;
    const { userId } = req.query;

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
