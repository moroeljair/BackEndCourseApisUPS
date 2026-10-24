import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "alumno",
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model("User", userSchema);
