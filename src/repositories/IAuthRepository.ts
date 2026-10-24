export type User = {
  id: string;
  email: string;
  password: string;
  role: string;
};

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;

  create(email: string, password: string, role?: string): Promise<User>;
}
