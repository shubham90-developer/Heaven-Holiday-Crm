const request = require("supertest");
const path = require("path");

// ✅ mock model
jest.mock("./b2cLead.model", () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

// ✅ clean absolute path
const app = require("../../../app").default;

const B2CLead = require("./b2cLead.model");

describe("POST /v1/api/b2c-leads", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ✅ SUCCESS CASE
    it("should create a new lead", async () => {

        B2CLead.findOne.mockResolvedValue(null);

        B2CLead.create.mockResolvedValue({
            _id: "123",
            firstName: "John"
        });

        const res = await request(app)
            .post("/v1/api/b2c-leads")
            .send({
                email: "test@gmail.com",
                mobile: "9876543210",
                salutation: "Mr.",
                firstName: "John",
                lastName: "Doe",
                leadSource: "Instagram",
                leadStage: "New"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Lead created successfully");
    });

    // ❌ MISSING FIELDS
    it("should return 400 if fields missing", async () => {

        const res = await request(app)
            .post("/v1/api/b2c-leads")
            .send({}); // empty body

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Please enter all the mandatory fields");
    });

    // ❌ DUPLICATE LEAD
    it("should return 400 if lead exists", async () => {

        B2CLead.findOne.mockResolvedValue({ _id: "exists" });

        const res = await request(app)
            .post("/v1/api/b2c-leads")
            .send({
                email: "test@gmail.com",
                mobile: "9876543210",
                salutation: "Mr.",
                firstName: "John",
                lastName: "Doe",
                leadSource: "Instagram",
                leadStage: "New"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
            "Lead with this email & mobile already exists!"
        );
    });

    // ❌ SERVER ERROR
    it("should return 500 on DB error", async () => {

        B2CLead.findOne.mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .post("/v1/api/b2c-leads")
            .send({
                email: "test@gmail.com",
                mobile: "9876543210",
                salutation: "Mr.",
                firstName: "John",
                lastName: "Doe",
                leadSource: "Instagram",
                leadStage: "New"
            });

        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });

});