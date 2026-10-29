import request from "supertest";
import app from "../../../app";

describe("User Authentication Integration Test Suite", () => {

    it("should register user", async () => {

        const response = await request(app)
            .post("/v1/api/auth/register")
            .send({
                name: "Muskan",
                email: "muskan@test.com",
                password: "123456"
            });

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.message)
            .toBe("User signed up successfully");
    });

    it("should login user", async () => {

        await request(app)
            .post("/v1/api/auth/register")
            .send({
                name: "Muskan",
                email: "muskan@test.com",
                password: "123456"
            });

        const response = await request(app)
            .post("/v1/api/auth/login")
            .send({
                email: "muskan@test.com",
                password: "123456"
            });

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.message)
            .toBe("Login successfull");

        expect(response.body.accessToken)
            .toBeDefined();

        expect(response.body.refreshToken)
            .toBeDefined();
    });

    it("should logout successfully", async () => {

        const response = await request(app)
            .post("/v1/api/auth/logout");

        expect(response.status).toBe(200);

        expect(response.body)
            .toMatchObject({
                success: true,
                message: "Logged out successfully"
            });
    });

});