import { UserModel } from "../models/user.js";
import type { IAuthRepository, User } from "./IAuthRepository.js";

export class MongooseAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }

  async create(
    email: string,
    password: string,
    role = "alumno",
  ): Promise<User> {
    const user = await UserModel.create({
      email,
      password,
      role,
    });

    return {
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }
}
