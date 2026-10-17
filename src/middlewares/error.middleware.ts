import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { errorResponse } from "../utils/api-response.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
): void => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    errorResponse(res, 400, "Error de validación", errors);
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((validationError) => ({
      field: validationError.path,
      message: validationError.message,
    }));

    errorResponse(res, 400, "Error de validación de datos", errors);
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    errorResponse(res, 400, "El identificador proporcionado no es válido");
    return;
  }

  console.error("Error no controlado:", error);

  errorResponse(res, 500, "Error interno del servidor");
};
