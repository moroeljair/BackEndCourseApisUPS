import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Acceso denegado: token de autenticación no proporcionado",
    });

    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Acceso denegado: token de autenticación no proporcionado",
    });

    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    next(new Error("JWT_SECRET no está configurado"));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      typeof decoded.role !== "string"
    ) {
      res.status(403).json({
        success: false,
        message: "El token no contiene un usuario válido",
      });

      return;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "El token ha expirado o no es válido",
    });
  }
};
