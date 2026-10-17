import type { Employee, IEmployeeRepository } from "./IEmployeeRepository.js";
import EmployeeModel from "../models/empleado.js";

export class MongooseEmployeeRepository implements IEmployeeRepository {
  async findAll(): Promise<Employee[]> {
    const employees = await EmployeeModel.find().lean();
    return employees.map((employee) => ({
      id: employee._id.toString(),
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
    }));
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = await EmployeeModel.findById(id).lean();
    if (!employee) {
      return null;
    }
    return {
      id: employee._id.toString(),
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
    };
  }

  async create(employee: Employee): Promise<Employee> {
    const createdEmployee = await EmployeeModel.create({
      nombre: employee.nombre,
      cargo: employee.cargo,
      departamento: employee.departamento,
      sueldo: employee.sueldo,
    });

    return {
      id: createdEmployee._id.toString(),
      nombre: createdEmployee.nombre,
      cargo: createdEmployee.cargo,
      departamento: createdEmployee.departamento,
      sueldo: createdEmployee.sueldo,
    };
  }

  async update(
    id: string,
    employee: Partial<Employee>,
  ): Promise<Employee | null> {
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      employee,
      { new: true },
    );

    if (!updatedEmployee) {
      return null;
    }

    return {
      id: updatedEmployee._id.toString(),
      nombre: updatedEmployee.nombre,
      cargo: updatedEmployee.cargo,
      departamento: updatedEmployee.departamento,
      sueldo: updatedEmployee.sueldo,
    };
  }

  async delete(id: string): Promise<boolean> {
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
    return deletedEmployee !== null;
  }
}
