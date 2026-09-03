import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// authMiddleware.ts
export const protect = (req: Request, res: Response, next: NextFunction) => {
  // const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer TOKEN"

  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      firmId: string;
      userName: string;
    };

    // Attach the user ID to the request object
    req.user = {
      id: decoded.userId,
      firmId: decoded.firmId,
      userName: decoded.userName,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
