import { ZodError, ZodTypeAny } from "zod";

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
const formikZodValidator = (schema: ZodTypeAny) => {
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

export default formikZodValidator;
