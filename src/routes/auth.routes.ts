import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers.js";
import type { IAuthRepository } from "../repositories/IAuthRepository.js";
import {
  loginSchema,
  registerSchema,
} from "../dtos/auth.dto.js";
import { validateBody } from "../middlewares/validate.middleware.js";

export const createAuthRoutes = (authRepository: IAuthRepository) => {
  const router = Router();
  const controller = new AuthController(authRepository);

  router.post(
    "/login",
    validateBody(loginSchema),
    controller.login,
  );
  router.post(
    "/register",
    validateBody(registerSchema),
    controller.register,
  );

  return router;
};
