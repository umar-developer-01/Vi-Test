import { describe, expect, test, it, vi } from "vitest";
import request from "supertest";
import { app } from "../index";
import { prismaClient } from "../__mocks__/db";


vi.mock("../db");


//By using spies in addition to mocks, you can ensure that your tests not only verify the expected output 
//but also validate that the functions or modules under test are called with the correct input values. 
//This approach helps catch flaky tests and improves the reliability and accuracy of your test suite.
 
describe("POST /sum", () => {
  it("should return the sum of two numbers with input checking", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 1,
      result: 3
    });
    // Create a spy on the prismaClient.sum.create function.
    vi.spyOn(prismaClient.sum, "create");

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2
    });
    //Assert that the function was called with the correct input values
    expect(prismaClient.sum.create).toHaveBeenCalledWith({
      data: {
        a: 11,
        b: 22,
        result: 3
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return the sum of two numbers", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 5,
      a: 1,
      b: 1,
      result: 3,
    });

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
    expect(res.body.id).toBe(5);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).post("/sum").send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });
});

describe("GET /sum", () => {
  it("should return the sum of two numbers", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 1,
      result: 3,
    });

    const res = await request(app)
      .get("/sum")
      .set({
        a: "1",
        b: "2",
      })
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it("should return 411 if no inputs are provided", async () => {
    const res = await request(app).get("/sum").send();
    expect(res.statusCode).toBe(411);
  });
});
