export type ValidationErrors = Record<string, string>;

/**
 * Converts Joi or Zod errors into a Formik-compatible error object.
 *
 * @param errors - Array of error details from Joi or Zod
 * @returns A structured error object.
 */
export const formatValidationErrors = (
  errors: { path: (string | number)[]; message: string }[]
): ValidationErrors => {
  return errors.reduce((acc: ValidationErrors, err) => {
    if (err.path.length > 0) acc[err.path.join(".")] = err.message;
    return acc;
  }, {});
};
