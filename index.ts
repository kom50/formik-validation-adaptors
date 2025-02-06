import { ZodError, ZodTypeAny } from "zod";

/**
 * Converts Zod validation schema for Formik.
 *
 * @param schema - The Zod schema to validate.
 * @returns A function to use in Formik's `validate` prop.
 */
export const formikZodValidator = (schema: ZodTypeAny) => {
  return async (values: any) => {
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

export const TestConsole = (data: any) => {
  console.log("ooo");
  return data;
};
