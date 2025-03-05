import { formikZodValidator } from "../lib/index";
import { describe, it, expect } from "vitest";
import { z } from "zod";

// Sample schemas
const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

describe("formikZodValidator", () => {
  it("should return an empty object for valid values", async () => {
    const validate = formikZodValidator(schema);
    const values = { name: "John", email: "john@example.com" };

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return errors for invalid values", async () => {
    const validate = formikZodValidator(schema);
    const values = { name: "Jo", email: "invalid-email" };

    const errors = await validate(values);
    expect(errors).toEqual({
      name: "Name must be at least 3 characters",
      email: "Invalid email address",
    });
  });

  it("should return an empty object if schema passes validation", async () => {
    const validate = formikZodValidator(schema);
    const values = { name: "Alice", email: "alice@example.com" };

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return multiple errors if multiple fields are invalid", async () => {
    const validate = formikZodValidator(schema);
    const values = { name: "", email: "" };

    const errors = await validate(values);
    expect(errors).toEqual({
      name: "Name must be at least 3 characters",
      email: "Invalid email address",
    });
  });

  it("should handle additional fields that are not in schema", async () => {
    const validate = formikZodValidator(schema);
    const values = { name: "John", email: "john@example.com", age: 30 };

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return an empty object if values are empty but schema has no required fields", async () => {
    const optionalSchema = z.object({
      name: z.string().optional(),
      email: z.string().optional(),
    });

    const validate = formikZodValidator(optionalSchema);
    const values = {};

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return an empty object if no errors occur", async () => {
    const validate = formikZodValidator(schema);
    const values = { name: "Valid Name", email: "valid@example.com" };

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should handle nested objects properly", async () => {
    const nestedSchema = z.object({
      user: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
      }),
    });

    const validate = formikZodValidator(nestedSchema);
    const values = { user: { name: "Jo", email: "invalid-email" } };

    const errors = await validate(values);
    expect(errors).toEqual({
      "user.name": "Name must be at least 3 characters",
      "user.email": "Invalid email address",
    });
  });
});

// Define schema for an array of objects
const arraySchema = z.array(
  z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
  })
);

describe("formikZodValidator - Array of Objects", () => {
  it("should return an empty object for an array of valid objects", async () => {
    const validate = formikZodValidator(arraySchema);
    const values = [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
    ];

    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return errors for an array with invalid objects", async () => {
    const validate = formikZodValidator(arraySchema);
    const values = [
      { name: "Al", email: "invalid-email" }, // Invalid entry
      { name: "", email: "bob@invalid" }, // Invalid entry
    ];

    const errors = await validate(values);
    expect(errors).toEqual({
      "0.name": "Name must be at least 3 characters",
      "0.email": "Invalid email address",
      "1.name": "Name must be at least 3 characters",
      "1.email": "Invalid email address",
    });
  });

  it("should return errors for an array with mixed valid and invalid objects", async () => {
    const validate = formikZodValidator(arraySchema);
    const values = [
      { name: "Valid Name", email: "valid@example.com" }, // Valid
      { name: "Jo", email: "invalid-email" }, // Invalid
    ];

    const errors = await validate(values);
    expect(errors).toEqual({
      "1.name": "Name must be at least 3 characters",
      "1.email": "Invalid email address",
    });
  });

  it("should return errors when required fields are missing", async () => {
    const validate = formikZodValidator(arraySchema);
    const values = [
      { name: "", email: "" }, // Missing both fields
      { name: "Valid Name", email: "valid@example.com" }, // Valid
    ];

    const errors = await validate(values);
    expect(errors).toEqual({
      "0.name": "Name must be at least 3 characters",
      "0.email": "Invalid email address",
    });
  });

  it("should handle empty array input", async () => {
    const validate = formikZodValidator(arraySchema);
    const values = [];

    const errors = await validate(values);
    expect(errors).toEqual({});
  });
});
