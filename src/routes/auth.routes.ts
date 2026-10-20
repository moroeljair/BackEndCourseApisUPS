import { Router } from "express";

import { login, register } from "../controllers/auth.controller.js";

import { loginSchema, registerSchema } from "../dtos/auth.dto.js";

import { validateBody } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validateBody(registerSchema.shape.body), register);

router.post("/login", validateBody(loginSchema.shape.body), login);

export default router;
