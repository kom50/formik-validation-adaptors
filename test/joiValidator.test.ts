import { describe, it, expect } from "vitest";
import { formikJoiValidator } from "../lib/index";
import Joi from "joi";

describe("formikJoiValidator", () => {
  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required",
      "string.empty": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
    age: Joi.number().min(18).messages({
      "number.min": "Age must be at least 18",
    }),
    // tags: Joi.array().items(Joi.string().min(2)).messages({
    //   "array.includes": "Each tag must be at least 2 characters",
    // }),
    tags: Joi.array().items(
      Joi.string().min(2).messages({
        "string.min": "Each tag must be at least 2 characters",
      })
    ),
  });

  it("should return an empty object for valid values", async () => {
    const validate = formikJoiValidator(schema);
    const values = {
      name: "John",
      email: "john@example.com",
      age: 25,
      tags: ["js", "ts"],
    };
    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return errors for invalid values", async () => {
    const validate = formikJoiValidator(schema);
    const values = { name: "Jo", email: "invalid-email", age: 15, tags: ["a"] };
    const errors = await validate(values);

    expect(errors).toEqual({
      name: "Name must be at least 3 characters",
      email: "Invalid email address",
      age: "Age must be at least 18",
      "tags.0": "Each tag must be at least 2 characters",
    });
  });

  it("should handle missing required fields", async () => {
    const validate = formikJoiValidator(schema);
    const values = {};
    const errors = await validate(values);
    expect(errors).toEqual({
      name: "Name is required",
      email: "Email is required",
    });
  });

  it("should handle additional fields that are not in schema", async () => {
    const validate = formikJoiValidator(schema);
    const values = {
      name: "John",
      email: "john@example.com",
      extra: "extra field",
    };
    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should handle array of valid values", async () => {
    const arraySchema = Joi.array().items(schema);
    const validate = formikJoiValidator(arraySchema);
    const values = [
      { name: "Alice", email: "alice@example.com", age: 22, tags: ["dev"] },
      {
        name: "Bob",
        email: "bob@example.com",
        age: 30,
        tags: ["code", "react"],
      },
    ];
    const errors = await validate(values);
    expect(errors).toEqual({});
  });

  it("should return errors for array of invalid values", async () => {
    const arraySchema = Joi.array().items(schema);
    const validate = formikJoiValidator(arraySchema);
    const values = [
      { name: "Al", email: "invalid", age: 16, tags: ["x"] },
      { name: "", email: "bob@invalid", age: 10, tags: ["y"] },
    ];
    const errors = await validate(values);
    expect(errors).toEqual({
      "0.name": "Name must be at least 3 characters",
      "0.email": "Invalid email address",
      "0.age": "Age must be at least 18",
      "0.tags.0": "Each tag must be at least 2 characters",
      "1.name": "Name is required",
      "1.email": "Invalid email address",
      "1.age": "Age must be at least 18",
      "1.tags.0": "Each tag must be at least 2 characters",
    });
  });
});
