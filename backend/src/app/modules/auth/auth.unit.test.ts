import request from "supertest";
import app from "../../../app";
import bcrypt from "bcryptjs";
import { User } from "./auth.model";
import {
    generateAccessToken,
    generateRefreshToken
} from "../../utils/jwt";

jest.mock("./auth.model"); //Mock real mongoose database model

jest.mock("bcryptjs", () => ({ //Mock bcrypt hashing library
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock("../../utils/jwt", () => ({ //Mock jwt utils
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn()
}));

describe("Authentication APIs", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // REGISTER TEST
    it("should create a new user", async () => {

        (User.findOne as jest.Mock) //Mock user model findOne functin with value as null
            .mockResolvedValue(null);

        (bcrypt.hash as jest.Mock) //Mock bcrypt library as with value as "hashedPassword"
            .mockResolvedValue("hashedPassword");

        (User.create as jest.Mock) //Mock User create function with the given value
            .mockResolvedValue({
                _id: "123",
                name: "Muskan",
                email: "muskan@test.com",
                role: "admin"
            });

        (generateAccessToken as jest.Mock) //Mock generate Access Token with value as fakeAccess
            .mockReturnValue("fakeAccess");

        (generateRefreshToken as jest.Mock) //Mock generate Refresh token with value as fakeRefresh
            .mockReturnValue("fakeRefresh");

        const response = await request(app)
            .post("/v1/api/auth/register") //send post request
            .send({
                name: "Muskan",
                email: "muskan@test.com",
                password: "123456"
            });

        expect(response.status).toBe(200); //expected response status must be 200

        expect(response.body).toMatchObject({ //expected response body must match object
            success: true
        });
    });


    // LOGIN TEST
    it("should login successfully", async () => {

        (User.findOne as jest.Mock) //Mock user findOne with the given resolved value
            .mockResolvedValue({
                _id: "123",
                email: "muskan@test.com",
                password: "hashedPassword",
                role: "admin"
            });

        (bcrypt.compare as jest.Mock) //Mock bcrypt hashing library with the resolved value as true
            .mockResolvedValue(true);

        (generateAccessToken as jest.Mock) //Mock Access Token with the return value as "fakeAccess"
            .mockReturnValue("fakeAccess");

        (generateRefreshToken as jest.Mock) //Mock Access Token with the return value as "fakeRefresh"
            .mockReturnValue("fakeRefresh");

        const response = await request(app)
            .post("/v1/api/auth/login")
            .send({
                email: "muskan@test.com",
                password: "123456"
            });

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: "Login successfull"
        });

        expect(User.findOne)
            .toHaveBeenCalledWith({
                email: "muskan@test.com"
            });

    });


    // LOGOUT TEST
    it("should logout successfully", async () => {

        const response = await request(app)
            .post("/v1/api/auth/logout");

        expect(response.status).toBe(200);

        expect(response.body).toMatchObject({
            success: true,
            message: "Logged out successfully"
        });

    });

});