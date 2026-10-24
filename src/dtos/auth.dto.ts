import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "El correo electrónico es obligatorio" })
    .trim()
    .email("El formato del correo electrónico no es válido"),

  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  email: z
    .string({ error: "El correo electrónico es obligatorio" })
    .trim()
    .email("El formato del correo electrónico no es válido"),

  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),

  role: z.string().trim().optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
