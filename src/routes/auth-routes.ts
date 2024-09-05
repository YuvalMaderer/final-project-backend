import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import {
  register,
  logIn,
  getUserById,
} from "../controllers/auth-controller";
import { verifyToken } from "../middelware/auth-middelware";
import { signWithGoogle, verifyGoogle } from "../controllers/google-controller";


type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const typedSignGoogle = signWithGoogle as RequestHandler;
const typedVerifyGoogle = verifyGoogle as Middleware;

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", logIn);
authRoutes.get("/loggedInUser", verifyToken, getUserById);
authRoutes.post("/google", typedVerifyGoogle, typedSignGoogle);
