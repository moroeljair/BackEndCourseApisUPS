import type { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const { nombre, email, password, role } = req.body;

  const usuario = await authService.register(nombre, email, password, role);

  res.status(201).json({
    success: true,
    data: usuario,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const resultado = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: resultado,
  });
};
