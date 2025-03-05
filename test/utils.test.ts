import { describe, expect, it } from "vitest";
import { formatValidationErrors } from "../lib/utils";

describe("formatValidationErrors", () => {
  it("should correctly format errors", () => {
    const errors = [
      { path: ["name"], message: "Name is required" },
      { path: ["email"], message: "Invalid email format" },
      { path: ["address", "city"], message: "City is required" },
    ];

    const formatted = formatValidationErrors(errors);

    expect(formatted).toEqual({
      name: "Name is required",
      email: "Invalid email format",
      "address.city": "City is required",
    });
  });

  it("should return an empty object for empty errors", () => {
    expect(formatValidationErrors([])).toEqual({});
  });
});
