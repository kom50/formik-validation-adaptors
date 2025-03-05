import { describe, it, expect } from "vitest";
import { create, test } from "vest";
import formikVestValidator from "../lib/vestValidator";

// Define a Vest validation suite
const suite = create((data) => {
  test("name", "Name is required", () => {
    if (!data.name) {
      throw new Error("Name is required");
    }
  });

  test("email", "Invalid email format", () => {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      throw new Error("Invalid email format");
    }
  });

  test("age", "Age must be a number", () => {
    if (data.age && isNaN(Number(data.age))) {
      throw new Error("Age must be a number");
    }
  });
});

describe("formikVestValidator", () => {
  it("should return an empty object for valid input", async () => {
    const validate = formikVestValidator(suite);
    const values = { name: "John", email: "john@example.com", age: "25" };

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return an error for missing required fields", async () => {
    const validate = formikVestValidator(suite);
    const values = { name: "", email: "" };

    const errors = await validate(values);
    expect(errors).toEqual({
      name: "Name is required",
      email: "Invalid email format",
    });
  });

  it("should return an error for invalid email format", async () => {
    const validate = formikVestValidator(suite);
    const values = { name: "Alice", email: "invalid-email" };

    const errors = await validate(values);
    expect(errors).toEqual({
      email: "Invalid email format",
    });
  });

  it("should return errors for multiple invalid fields", async () => {
    const validate = formikVestValidator(suite);
    const values = { name: "", email: "invalid-email", age: "abc" };

    const errors = await validate(values);
    expect(errors).toEqual({
      name: "Name is required",
      email: "Invalid email format",
      age: "Age must be a number",
    });
  });

  it("should ignore unknown fields and return no errors", async () => {
    const validate = formikVestValidator(suite);
    const values = { name: "John", email: "john@example.com", age: "30", extraField: "SomeValue" };

    const errors = await validate(values);
    expect(errors).toEqual({});
  });
});
