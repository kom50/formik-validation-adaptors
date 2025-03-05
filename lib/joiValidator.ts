import { Schema } from "joi";

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
const formikJoiValidator = (schema: Schema) => {
  return async (values: Record<string, any>) => {
    try {
      const { error } = schema.validate(values, {
        abortEarly: false,
        allowUnknown: true,
      });

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

export default formikJoiValidator;
