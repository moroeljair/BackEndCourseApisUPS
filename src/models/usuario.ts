import mongoose, { Schema } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  },
);

export const Usuario = mongoose.model("Usuario", usuarioSchema);
