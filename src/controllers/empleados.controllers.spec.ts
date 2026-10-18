import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { createEmployeeController } from "./empleados.controllers.js";
import type { IEmployeeRepository } from "../repositories/IEmployeeRepository.js";

describe("Empleados controller", () => {
  const mockRepository: jest.Mocked<IEmployeeRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debería retornar un estado 200 y la lista de empleados desde el repositorio", async () => {
    const fakeEmployees = [
      {
        nombre: "Andrés Mendoza",
        cargo: "Arquitecto",
        departamento: "TI",
        sueldo: 4000,
      },
    ];

    mockRepository.findAll.mockResolvedValue(fakeEmployees);

    const controller = createEmployeeController(mockRepository);

    await controller.getEmpleado(
      {} as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "Empleados obtenidos correctamente",
      data: fakeEmployees,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería delegar el error a next cuando el repositorio falla", async () => {
    const repositoryError = new Error("Error simulado del repositorio");

    mockRepository.findAll.mockRejectedValue(repositoryError);

    const controller = createEmployeeController(mockRepository);

    await controller.getEmpleado(
      {} as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(repositoryError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("Debería retornar 200 y el empleado cuando existe", async () => {
    const employeeId = "507f1f77bcf86cd799439011";
    const fakeEmployee = {
      id: employeeId,
      nombre: "Andrés Mendoza",
      cargo: "Arquitecto",
      departamento: "TI",
      sueldo: 4000,
    };

    mockRepository.findById.mockResolvedValue(fakeEmployee);

    const controller = createEmployeeController(mockRepository);

    await controller.getEmpleadoById(
      { params: { id: employeeId } } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "Empleado obtenido correctamente",
      data: fakeEmployee,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería retornar 404 cuando el empleado no existe", async () => {
    const employeeId = "507f1f77bcf86cd799439011";

    mockRepository.findById.mockResolvedValue(null);

    const controller = createEmployeeController(mockRepository);

    await controller.getEmpleadoById(
      { params: { id: employeeId } } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Empleado no encontrado",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería retornar 201 y el empleado creado", async () => {
    const employeeInput = {
      nombre: "Andrés Mendoza",
      cargo: "Arquitecto",
      departamento: "TI",
      sueldo: 4000,
    };
    const createdEmployee = {
      id: "507f1f77bcf86cd799439011",
      ...employeeInput,
    };

    mockRepository.create.mockResolvedValue(createdEmployee);

    const controller = createEmployeeController(mockRepository);

    await controller.addEmpleado(
      { body: employeeInput } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(employeeInput);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "Empleado creado correctamente",
      data: createdEmployee,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería delegar el error a next cuando falla la creación del empleado", async () => {
    const employeeInput = {
      nombre: "Andrés Mendoza",
      cargo: "Arquitecto",
      departamento: "TI",
      sueldo: 4000,
    };
    const repositoryError = new Error("Error al crear empleado");

    mockRepository.create.mockRejectedValue(repositoryError);

    const controller = createEmployeeController(mockRepository);

    await controller.addEmpleado(
      { body: employeeInput } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(employeeInput);
    expect(mockNext).toHaveBeenCalledWith(repositoryError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("Debería retornar 200 y el empleado actualizado", async () => {
    const employeeId = "507f1f77bcf86cd799439011";
    const updateInput = {
      cargo: "Líder Técnico",
      sueldo: 5000,
    };
    const updatedEmployee = {
      id: employeeId,
      nombre: "Andrés Mendoza",
      cargo: "Líder Técnico",
      departamento: "TI",
      sueldo: 5000,
    };

    mockRepository.update.mockResolvedValue(updatedEmployee);

    const controller = createEmployeeController(mockRepository);

    await controller.updateEmpleado(
      { params: { id: employeeId }, body: updateInput } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.update).toHaveBeenCalledWith(employeeId, updateInput);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "Empleado actualizado correctamente",
      data: updatedEmployee,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería retornar 404 cuando se intenta actualizar un empleado inexistente", async () => {
    const employeeId = "507f1f77bcf86cd799439011";
    const updateInput = {
      cargo: "Líder Técnico",
      sueldo: 5000,
    };

    mockRepository.update.mockResolvedValue(null);

    const controller = createEmployeeController(mockRepository);

    await controller.updateEmpleado(
      { params: { id: employeeId }, body: updateInput } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.update).toHaveBeenCalledWith(employeeId, updateInput);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Empleado no encontrado",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería retornar 200 cuando el empleado se elimina correctamente", async () => {
    const employeeId = "507f1f77bcf86cd799439011";

    mockRepository.delete.mockResolvedValue(true);

    const controller = createEmployeeController(mockRepository);

    await controller.deleteEmpleado(
      { params: { id: employeeId } } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(employeeId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: "Empleado eliminado correctamente",
      data: null,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Debería retornar 404 cuando se intenta eliminar un empleado inexistente", async () => {
    const employeeId = "507f1f77bcf86cd799439011";

    mockRepository.delete.mockResolvedValue(false);

    const controller = createEmployeeController(mockRepository);

    await controller.deleteEmpleado(
      { params: { id: employeeId } } as Request,
      mockResponse,
      mockNext,
    );

    expect(mockRepository.delete).toHaveBeenCalledWith(employeeId);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: "Empleado no encontrado",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
