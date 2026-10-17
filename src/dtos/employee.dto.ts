import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "El ID debe ser un ObjectId válido de MongoDB");

export const createEmployeeSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres"),

    cargo: z
      .string()
      .trim()
      .min(3, "El cargo debe tener al menos 3 caracteres"),

    departamento: z
      .string()
      .trim()
      .min(2, "El departamento debe tener al menos 2 caracteres"),

    sueldo: z
      .number({
        error: "El sueldo debe ser un número",
      })
      .positive("El sueldo debe ser mayor que cero"),
  })
  .strict();

export const updateEmployeeSchema = createEmployeeSchema
  .partial()
  .refine(
    (employee) => Object.keys(employee).length > 0,
    "Debe enviar al menos un campo para actualizar",
  );

export const employeeParamsSchema = z
  .object({
    id: objectIdSchema,
  })
  .strict();

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
