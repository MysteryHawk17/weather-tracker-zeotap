import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
export interface AuthPayload {
  _id: Schema.Types.ObjectId;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
