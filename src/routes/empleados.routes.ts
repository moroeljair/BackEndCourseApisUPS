import { Router } from "express";
import { createEmployeeController } from "../controllers/empleados.controllers.js";
import type { IEmployeeRepository } from "../repositories/IEmployeeRepository.js";
import {
  validateBody,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  createEmployeeSchema,
  employeeParamsSchema,
  updateEmployeeSchema,
} from "../dtos/employee.dto.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

export const createEmployeeRoutes = (
  employeeRepository: IEmployeeRepository,
) => {
  const router = Router();
  const controller = createEmployeeController(employeeRepository);

  router.get("/empleados", controller.getEmpleado);
  router.get("/empleados/:id", controller.getEmpleadoById);
  router.post(
    "/empleados",
    authenticateJWT,
    validateBody(createEmployeeSchema),
    controller.addEmpleado,
  );
  router.put(
    "/empleados/:id",
    authenticateJWT,
    validateParams(employeeParamsSchema),
    validateBody(updateEmployeeSchema),
    controller.updateEmpleado,
  );
  router.delete(
    "/empleados/:id",
    authenticateJWT,
    validateParams(employeeParamsSchema),
    controller.deleteEmpleado,
  );
  return router;
};
