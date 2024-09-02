import { NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User, { IUser } from "../models/user-model";
import { Document } from "mongoose";

const SALT_ROUNDS = 10;
const { JWT_SECRET } = process.env;

interface GoogleCredential {
  email: string;
  given_name: string;
  family_name: string;
  picture: string
}

interface VerifyGoogleRequest extends Request {
  body: { credential: string };
  credentialDecoded?: GoogleCredential;
  user?: Document<unknown, {}, IUser> & IUser;
}

interface SignWithGoogleRequest extends Request {
  credentialDecoded?: GoogleCredential;
  user?: Document<unknown, {}, IUser> & IUser;
}

async function verifyGoogle(
  req: VerifyGoogleRequest,
  res: Response,
  next: NextFunction
) {
  const { credential } = req.body;

  let credentialDecoded: GoogleCredential;

  try {
    credentialDecoded = jwtDecode(credential) as GoogleCredential;
    req.credentialDecoded = credentialDecoded;
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }

  try {
    const { email } = credentialDecoded;
    let user = await User.findOne({ email });

    if (user) {
      req.user = user;
    }
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }

  next();
}

async function signWithGoogle(req: SignWithGoogleRequest, res: Response) {
  const { credentialDecoded } = req;

  if (!credentialDecoded)
    return res.status(500).json({ error: "Authentication with Google failed" });

  const {
    email,
    given_name: firstName,
    family_name: lastName,
    picture: picture
  } = credentialDecoded;

  try {
    let user = req.user;
    if (!user) {
      const hashedPassword = await bcryptjs.hash(
        Math.random().toString(36).slice(-8),
        SALT_ROUNDS
      );
      user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        birthday: new Date(),
        picture: picture
      });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET!, {
      expiresIn: "5h",
    });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication with Google failed" });
  }
}

export { verifyGoogle, signWithGoogle };
