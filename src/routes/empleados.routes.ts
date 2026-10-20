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
import { authorize } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const createEmployeeRoutes = (
  employeeRepository: IEmployeeRepository,
) => {
  const router = Router();
  const controller = createEmployeeController(employeeRepository);

  // Todas las rutas de empleados requieren autenticación
  router.use(authenticate);

  router.get("/empleados", controller.getEmpleado);
  router.get(
    "/empleados/:id",
    validateParams(employeeParamsSchema),
    controller.getEmpleadoById,
  );
  router.post(
    "/empleados",
    authorize("ADMIN"),
    validateBody(createEmployeeSchema),
    controller.addEmpleado,
  );
  router.put(
    "/empleados/:id",
    authorize("ADMIN"),
    validateParams(employeeParamsSchema),
    validateBody(updateEmployeeSchema),
    controller.updateEmpleado,
  );
  router.delete(
    "/empleados/:id",
    authorize("ADMIN"),
    validateParams(employeeParamsSchema),
    controller.deleteEmpleado,
  );
  return router;
};
