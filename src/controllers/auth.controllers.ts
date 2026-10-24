import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IAuthRepository } from "../repositories/IAuthRepository.js";

export class AuthController {
  constructor(private readonly authRepository: IAuthRepository) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });

        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });

        return;
      }

      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error("JWT_SECRET no está configurado");
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        secret,
        {
          expiresIn: "2h",
        },
      );

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
          token,
          user: {
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password, role } = req.body;

      const existingUser = await this.authRepository.findByEmail(email);

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "El usuario ya se encuentra registrado",
        });

        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.authRepository.create(
        email,
        hashedPassword,
        role,
      );

      res.status(201).json({
        success: true,
        message: "Usuario registrado correctamente",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
