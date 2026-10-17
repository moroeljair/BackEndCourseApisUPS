import type { NextFunction, Request, Response } from "express";
import type {
  Employee,
  IEmployeeRepository,
} from "../repositories/IEmployeeRepository.js";
import { errorResponse, successResponse } from "../utils/api-response.js";

export const createEmployeeController = (
  employeeRepository: IEmployeeRepository,
) => ({
  getEmpleado: async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const empleados = await employeeRepository.findAll();

      successResponse(res, 200, "Empleados obtenidos correctamente", empleados);
    } catch (error) {
      next(error);
    }
  },

  getEmpleadoById: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.params.id || typeof req.params.id !== "string") {
        errorResponse(res, 400, "El ID del empleado es obligatorio");
        return;
      }
      const empleado = await employeeRepository.findById(req.params.id);

      if (!empleado) {
        errorResponse(res, 404, "Empleado no encontrado");
        return;
      }

      successResponse(res, 200, "Empleado obtenido correctamente", empleado);
    } catch (error) {
      next(error);
    }
  },

  addEmpleado: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const empleado = await employeeRepository.create(req.body as Employee);

      successResponse(res, 201, "Empleado creado correctamente", empleado);
    } catch (error) {
      next(error);
    }
  },

  updateEmpleado: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.params.id || typeof req.params.id !== "string") {
        errorResponse(res, 400, "El ID del empleado es obligatorio");
        return;
      }

      const empleado = await employeeRepository.update(req.params.id, req.body);

      if (!empleado) {
        errorResponse(res, 404, "Empleado no encontrado");
        return;
      }

      successResponse(res, 200, "Empleado actualizado correctamente", empleado);
    } catch (error) {
      next(error);
    }
  },

  deleteEmpleado: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.params.id || typeof req.params.id !== "string") {
        errorResponse(res, 400, "El ID del empleado es obligatorio");
        return;
      }

      const deleted = await employeeRepository.delete(req.params.id);

      if (!deleted) {
        errorResponse(res, 404, "Empleado no encontrado");
        return;
      }

      successResponse(res, 200, "Empleado eliminado correctamente", null);
    } catch (error) {
      next(error);
    }
  },
});
