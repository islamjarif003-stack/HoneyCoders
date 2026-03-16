import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

export interface AuthRequest extends Request {
  userId?: string;
  userRoles?: string[];
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;

    // Fetch roles
    const { rows } = await query("SELECT role FROM user_roles WHERE user_id = $1", [decoded.userId]);
    req.userRoles = rows.map((r) => r.role);

    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRoles || !roles.some((r) => req.userRoles!.includes(r))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};
