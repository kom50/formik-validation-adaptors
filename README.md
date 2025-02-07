# Formik Validation Adaptors

A lightweight utility package that provides validation adaptors for Formik using popular validation libraries like **Zod** and **Joi**. Easily integrate robust validation into your Formik forms with minimal setup.

## Installation

```bash
npm i formik-validation-adaptors
```

## Live Demo

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://stackblitz.com/edit/vitejs-vite-3vwtnro2?file=src%2FFormikValidationWithZod.tsx)

## Features

- Zod Adaptor: Validate Formik forms using Zod, a TypeScript-first schema validation library.
- Joi Adaptor: Validate Formik forms using Joi, a powerful schema description language and validator.
- Lightweight: Only includes the validation logic you need.
- TypeScript Support: Fully typed for better developer experience.

## Usage

#### Zod Adaptor

Validate Formik forms using Zod schemas.

```js
import { formikZodValidator } from "formik-validation-adaptors";
import { z } from "zod";
import { Formik, Form, Field } from "formik";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

const initialValues = {
  name: "",
  email: "",
};

const FormikValidationWithZod = () => (
  <Formik
    initialValues={initialValues}
    validate={formikZodValidator(schema)}
    onSubmit={(values) => console.log(values)}
  >
    {({ errors }) => (
      <Form>
        <Field name="name" />
        {errors.name && <div>{errors.name}</div>}
        <Field name="email" />
        {errors.email && <div>{errors.email}</div>}
        <br />
        <button type="submit">Submit</button>
      </Form>
    )}
  </Formik>
);

export default FormikValidationWithZod;
```

#### Joi Adaptor

Validate Formik forms using Joi schemas.

```js
import { formikJoiValidator } from "formik-validation-adaptors";
import Joi from "joi";
import { Formik, Form, Field } from "formik";

const schema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email",
      "string.empty": "Email is required",
    }),
});

const initialValues = {
  name: "",
  email: "",
};

const FormikValidationWithJoi = () => (
  <Formik
    initialValues={initialValues}
    validate={formikJoiValidator(schema)}
    onSubmit={(values) => console.log(values)}
  >
    {({ errors }) => (
      <Form>
        <Field name="name" />
        {errors.name && <div>{errors.name}</div>}
        <Field name="email" />
        {errors.email && <div>{errors.email}</div>}
        <button type="submit">Submit</button>
      </Form>
    )}
  </Formik>
);

export default FormikValidationWithJoi;
```

## Why Use This Package?

- **Seamless Integration**: Easily integrate Zod or Joi validation with Formik.
- **Type Safety**: Built with TypeScript for better type inference and error handling.
- **Flexibility**: Supports both Zod and Joi validation libraries.
- **Customizable**: Use your preferred validation library without additional boilerplate.
- **Lightweight**: Only includes the validation logic you need, keeping your bundle size small.
