import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Usuario, UserRole } from "../models/usuario.js";

export class AuthService {
  async register(
    nombre: string,
    email: string,
    password: string,
    role: UserRole,
  ) {
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      throw new Error("El usuario ya existe");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      role: role || UserRole.USER,
    });

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
    };
  }

  async login(email: string, password: string) {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      throw new Error("Credenciales incorrectas");
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      throw new Error("Credenciales incorrectas");
    }

    const token = jwt.sign(
      {
        sub: usuario._id.toString(),
        role: usuario.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    );

    return {
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }
}
