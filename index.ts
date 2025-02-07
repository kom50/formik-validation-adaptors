import { ZodError, ZodTypeAny } from "zod";
import { Schema } from "joi";

/**
 * A Formik-compatible validation function using Zod schema.
 *
 * @param {ZodTypeAny} schema - The Zod schema used for validation
 * @returns A validation function that Formik can use, returning validation errors.
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   name: z.string().min(3, "Name must be at least 3 characters 1"),
 *   email: z.string().email("Invalid email address"),
 *   email1: z.string().email("Invalid email address"),
 * });
 *
 * const formik = useFormik({
 *   initialValues: { name: "", email: "" },
 *   validate: formikZodValidator(schema),
 *   onSubmit: (values) => console.log(values),
 * });
 * ```
 */
export const formikZodValidator = (schema: ZodTypeAny) => {
  return async (values: Record<string, any>) => {
    try {
      await schema.parseAsync(values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const er = error.errors.reduce((acc: Record<string, string>, err) => {
          if (err.path.length > 0) acc[err.path.join(".")] = err.message;
          return acc;
        }, {});
        return er;
      }
      return {};
    }
  };
};

/**
 * A Formik-compatible validation function using Joi schema.
 *
 * @param {Schema} schema - The Joi schema used for validation.
 * @returns A validation function that Formik can use, returning validation errors.
 *
 * @example
 * ```ts
 * const schema = Joi.object({
 *   name: Joi.string().min(3).required(),
 *   email: Joi.string().email().required(),
 * });
 *
 * const formik = useFormik({
 *   initialValues: { name: "", email: "" },
 *   validate: formikJoiValidator(schema),
 *   onSubmit: (values) => console.log(values),
 * });
 * ```
 */
export const formikJoiValidator = (schema: Schema) => {
  return async (values: Record<string, any>) => {
    try {
      const { error } = schema.validate(values, { abortEarly: false });

      if (!error) return {};

      const validationErrors: Record<string, string> = error.details.reduce(
        (acc: Record<string, string>, err) => {
          if (err.path.length > 0) acc[err.path.join(".")] = err.message;
          return acc;
        },
        {}
      );

      return validationErrors;
    } catch (err) {
      return {};
    }
  };
};
