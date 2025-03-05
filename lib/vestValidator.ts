import { Suite } from "vest";

/**
 * A Formik-compatible validation function using Vest.
 * 
 * @param {Suite<string, string, (data: any) => void>} suite - The Vest test suite used for validation.
 * @returns A validation function for Formik, returning validation errors as an object.
 *
 * @example
 * ```ts
 * import vest, { test, create } from "vest";
 * import formikVestValidator from "./formikVestValidator";
 * 
 * // Define a Vest validation suite
 * const suite = create((data) => {
 *   test("name", "Name is required", () => {
 *     enforce(data.name).isNotEmpty();
 *   });
 * 
 *   test("email", "Invalid email format", () => {
 *     enforce(data.email).matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/);
 *   });
 * });
 * 
 * // Use in Formik
 * const formik = useFormik({
 *   initialValues: { name: "", email: "" },
 *   validate: formikVestValidator(suite),
 *   onSubmit: (values) => console.log(values),
 * });
 * ```
 */
const formikVestValidator = (suite: Suite<string, string, (data: any) => void>) => {
  return async (values: any): Promise<Record<string, string>> => {
    const result = suite(values);

    if (result.isValid()) return {};

    const errors = result.getErrors();

    const formattedErrors: Record<string, string> = {};
    for (const key in errors) {
      if (errors[key]?.length > 0) {
        formattedErrors[key] = errors[key][0]; // Take the first error message
      }
    }
    return formattedErrors;
  };
};

export default formikVestValidator;
