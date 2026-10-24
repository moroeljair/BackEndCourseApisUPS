import express from "express";
import morgan from "morgan";
import { MongooseEmployeeRepository } from "./repositories/MongooseEmployeeRepository.js";
import { createEmployeeRoutes } from "./routes/empleados.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
import { MongooseAuthRepository } from "./repositories/MongooseAuthRepository.js";
import { createAuthRoutes } from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
  }),
);

app.use(express.json());
app.use(morgan("dev"));

const employeeRepository = new MongooseEmployeeRepository();
const authRepository = new MongooseAuthRepository();

app.use("/api/v1/auth", createAuthRoutes(authRepository));
app.use("/api/v1", createEmployeeRoutes(employeeRepository));

app.use(errorHandler);

export default app;
