import request from "supertest";
import app from "../../../../app";
import { DepartmentModel } from "./department.model";

jest.mock("./department.model");

describe("Department APIs", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // CREATE DEPARTMENT
    it("should create a department", async () => {

        (DepartmentModel.create as jest.Mock)
            .mockResolvedValue({
                _id: "123",
                name: "Sales",
                isOperations: false,
                isActive: true
            });

        const response = await request(app)
            .post("/v1/api/staff-management/department")
            .send({
                name: "Sales"
            });

        expect(response.status).toBe(201);

        expect(response.body).toMatchObject({
            success: true,
            message: "Department created successfully"
        });

        expect(DepartmentModel.create)
            .toHaveBeenCalledWith({
                name: "Sales"
            });
    });


    // GET ALL DEPARTMENTS
    it("should get all departments", async () => {

        (DepartmentModel.find as jest.Mock)
            .mockResolvedValue([
                {
                    _id: "1",
                    name: "Sales"
                },
                {
                    _id: "2",
                    name: "Operations"
                }
            ]);

        const response = await request(app)
            .get("/v1/api/staff-management/department");

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(DepartmentModel.find)
            .toHaveBeenCalledWith({
                isActive: true
            });
    });


    // GET DEPARTMENT BY ID
    it("should get department by id", async () => {

        (DepartmentModel.findById as jest.Mock)
            .mockResolvedValue({
                _id: "123",
                name: "Sales"
            });

        const response = await request(app)
            .get("/v1/api/staff-management/department/123");

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);
    });


    // UPDATE DEPARTMENT
    it("should update department", async () => {

        (DepartmentModel.findByIdAndUpdate as jest.Mock)
            .mockResolvedValue({
                _id: "123",
                name: "Operations"
            });

        const response = await request(app)
            .patch("/v1/api/staff-management/department/123")
            .send({
                name: "Operations"
            });

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: "Department updated successfully"
        });
    });


    // DELETE (SOFT DELETE)
    it("should deactivate department", async () => {

        (DepartmentModel.findByIdAndUpdate as jest.Mock)
            .mockResolvedValue({
                _id: "123",
                isActive: false
            });

        const response = await request(app)
            .delete("/v1/api/staff-management/department/123");

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: "Department deactivated successfully"
        });
    });

});