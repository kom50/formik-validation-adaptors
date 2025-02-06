# Formik Validation Adaptors

A lightweight utility package that provides validation adaptors for Formik using popular validation libraries like **Zod** and **Joi**. Easily integrate robust validation into your Formik forms with minimal setup.

## Installation

```bash
npm install formik-zod-validator zod
```

or

```bash
yarn add formik-validation-adaptors
```

## Features

- Zod Adaptor: Validate Formik forms using Zod, a TypeScript-first schema validation library.
- Joi Adaptor: Validate Formik forms using Joi, a powerful schema description language and validator.
- Lightweight: Only includes the validation logic you need.
- TypeScript Support: Fully typed for better developer experience.

## Usage

#### Zod Adaptor

Validate Formik forms using Zod schemas.

```js
import { formikZodValidator } from "formik-zod-validator";
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

const MyForm = () => (
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
        <button type="submit">Submit</button>
      </Form>
    )}
  </Formik>
);
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

const MyForm = () => (
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
```

## Why Use This Package?

- **Seamless Integration**: Easily integrate Zod or Joi validation with Formik.

- **Type Safety**: Built with TypeScript for better type inference and error handling.

- **Flexibility**: Supports both Zod and Joi validation libraries.

- **Customizable**: Use your preferred validation library without additional boilerplate.

- **Lightweight**: Only includes the validation logic you need, keeping your bundle size small.
