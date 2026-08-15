import joi from "joi";

export const registerSchema = {
  body: joi
    .object({
      username: joi.string().min(3).max(30).required().messages({
        "string.base": "Username should be a type of text",
        "string.empty": "Username cannot be an empty field",
        "string.min": "Username should have a minimum length of 3",
        "string.max": "Username should have a maximum length of 30",
        "any.required": "Username is required",
      }),
      password: joi
        .string()
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        )
        .min(6)
        .max(20)
        .required()
        .messages({
          "string.base": "Password should be a type of text",
          "string.empty": "Password cannot be an empty field",
          "string.min": "Password should have a minimum length of 6",
          "string.max": "Password should have a maximum length of 20",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
          "any.required": "Password is required",
        }),
      confirmPassword: joi
        .string()
        .valid(joi.ref("password"))
        .required()
        .messages({
          "any.only": "Confirm password must match password",
          "string.empty": "Confirm password cannot be an empty field",
          "any.required": "Confirm password is required",
        }),
      email: joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.empty": "Email cannot be an empty field",
        "string.email": "Email should be a valid email address",
        "any.required": "Email is required",
      }),
      age: joi.number().max(100).min(10).required().messages({
        "number.base": "Age should be a type of number",
        "number.empty": "Age cannot be an empty field",
        "number.max": "Age should have a maximum value of 100",
        "number.min": "Age should have a minimum value of 10",
        "any.required": "Age is required",
      }),
      gender: joi.string().valid("male", "female").required().messages({
        "string.base": "Gender should be a type of text",
        "string.empty": "Gender cannot be an empty field",
        "any.only": "Gender must be either 'male' or 'female'",
        "any.required": "Gender is required",
      }),
      phone: joi.string().required().messages({
        "string.base": "Phone should be a type of text",
        "string.empty": "Phone cannot be an empty field",
        "any.required": "Phone is required",
      }),
    })
    .required(),
};

export const activateAccountSchema = {
  params: joi
    .object({
      token: joi.string().required().messages({
        "string.base": "Token should be a type of text",
        "string.empty": "Token cannot be an empty field",
        "any.required": "Token is required",
      }),
    })
    .required(),
};

export const loginSchema = {
  body: joi
    .object({
      email: joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.empty": "Email cannot be an empty field",
        "string.email": "Email should be a valid email address",
        "any.required": "Email is required",
      }),
      password: joi.string().min(6).max(20).required().messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password should have a minimum length of 6",
        "string.max": "Password should have a maximum length of 20",
        "any.required": "Password is required",
      }),
    })
    .required(),
};

export const forgotPasswordSchema = {
  params: joi
    .object({
      email: joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.empty": "Email cannot be an empty field",
        "string.email": "Email should be a valid email address",
        "any.required": "Email is required",
      }),
    })
    .required(),
};

export const resetPasswordSchema = {
  body: joi
    .object({
      email: joi.string().email().required().messages({
        "string.base": "Email should be a type of text",
        "string.empty": "Email cannot be an empty field",
        "string.email": "Email should be a valid email address",
        "any.required": "Email is required",
      }),
      forgetPasswordCode: joi.string().required().length(6).messages({
        "string.base": "Forget password code should be a type of text",
        "string.empty": "Forget password code cannot be an empty field",
        "string.length": "Forget password code should have a length of 6",
        "any.required": "Forget password code is required",
      }),
      password: joi
        .string()
        .min(6)
        .max(20)
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        )
        .required()
        .messages({
          "string.base": "Password should be a type of text",
          "string.empty": "Password cannot be an empty field",
          "string.min": "Password should have a minimum length of 6",
          "string.max": "Password should have a maximum length of 20",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
          "any.required": "Password is required",
        }),
      confirmPassword: joi
        .string()
        .valid(joi.ref("password"))
        .required()
        .messages({
          "any.only": "Confirm password must match password",
          "string.empty": "Confirm password cannot be an empty field",
          "any.required": "Confirm password is required",
        }),
    })
    .required(),
};
