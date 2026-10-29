import request from "supertest";
import app from "../../../../app";
import { StaffModel } from "./staff.model";

jest.mock("./staff.model");

const mockStaff = {
    _id: "123",
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul@company.com",
    phone: "9876543210",
    role: "665e8ab1f4a12f001234567",
    department: "665e8ab1f4a12f001234568",
    reportingManager: "Operations Head",
    isSelfSender: false,
    permissions: ["create_leads", "view_queries"],
    isActive: true,
};

describe("Staff APIs", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    // CREATE STAFF
    it("should create a staff member", async () => {

        (StaffModel.findOne as jest.Mock)
            .mockResolvedValue(null); // no duplicate email

        (StaffModel.create as jest.Mock)
            .mockResolvedValue(mockStaff);

        const response = await request(app)
            .post("/v1/api/staff-management/staff")
            .send({
                firstName: "Rahul",
                lastName: "Sharma",
                email: "rahul@company.com",
                phone: "9876543210",
                role: "665e8ab1f4a12f001234567",
                department: "665e8ab1f4a12f001234568",
                reportingManager: "Operations Head",
            });

        expect(response.status).toBe(201);

        expect(response.body).toMatchObject({
            success: true,
            message: "Staff created successfully",
        });

        expect(StaffModel.findOne).toHaveBeenCalledWith({
            email: "rahul@company.com",
        });

        expect(StaffModel.create).toHaveBeenCalled();
    });


    // CREATE STAFF - DUPLICATE EMAIL
    it("should return 400 if email already exists", async () => {

        (StaffModel.findOne as jest.Mock)
            .mockResolvedValue(mockStaff); // duplicate found

        const response = await request(app)
            .post("/v1/api/staff-management/staff")
            .send({
                firstName: "Rahul",
                lastName: "Sharma",
                email: "rahul@company.com",
                phone: "9876543210",
                role: "665e8ab1f4a12f001234567",
                department: "665e8ab1f4a12f001234568",
                reportingManager: "Operations Head",
            });

        expect(response.status).toBe(400);

        expect(response.body).toMatchObject({
            success: false,
            message: "Email already exists",
        });

        expect(StaffModel.create).not.toHaveBeenCalled();
    });


    // GET ALL STAFF
    it("should get all staff", async () => {

        const populateMock = jest.fn().mockResolvedValue([mockStaff]);

        (StaffModel.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: populateMock,
            }),
        });

        const response = await request(app)
            .get("/v1/api/staff-management/staff");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(StaffModel.find).toHaveBeenCalledWith({ isActive: true });
    });


    // GET STAFF BY ID
    it("should get staff by id", async () => {

        const populateMock = jest.fn().mockResolvedValue(mockStaff);

        (StaffModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: populateMock,
                }),
            }),
        });

        const response = await request(app)
            .get("/v1/api/staff-management/staff/123");

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(StaffModel.findById).toHaveBeenCalledWith("123");
    });


    // GET STAFF BY ID - NOT FOUND
    it("should return 404 if staff not found by id", async () => {

        const populateMock = jest.fn().mockResolvedValue(null);

        (StaffModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: populateMock,
                }),
            }),
        });

        const response = await request(app)
            .get("/v1/api/staff-management/staff/nonexistent");

        expect(response.status).toBe(404);

        expect(response.body).toMatchObject({
            success: false,
            message: "Staff not found",
        });
    });


    // UPDATE STAFF
    it("should update a staff member", async () => {

        (StaffModel.findByIdAndUpdate as jest.Mock)
            .mockResolvedValue({
                ...mockStaff,
                firstName: "Rahul Updated",
            });

        const response = await request(app)
            .patch("/v1/api/staff-management/staff/123")
            .send({
                firstName: "Rahul Updated",
            });

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: "Staff updated successfully",
        });

        expect(StaffModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { firstName: "Rahul Updated" },
            { new: true }
        );
    });


    // DEACTIVATE STAFF
    it("should deactivate a staff member", async () => {

        (StaffModel.findByIdAndUpdate as jest.Mock)
            .mockResolvedValue({
                ...mockStaff,
                isActive: false,
            });

        const response = await request(app)
            .delete("/v1/api/staff-management/staff/123");

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: "Staff deactivated successfully",
        });

        expect(StaffModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { isActive: false },
            { new: true }
        );
    });

});