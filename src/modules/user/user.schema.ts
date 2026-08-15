import joi from "joi";
import { isValidObjectId } from "mongoose";

export const updateUserRoleSchema = {
  params: joi
    .object({
      id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message({ custom: "Invalid user ID" });
          return value;
        })
        .required()
        .messages({
          "string.base": "User ID should be a type of text",
          "string.empty": "User ID cannot be an empty field",
          "any.required": "User ID is required",
        }),
    })
    .required(),
  body: joi
    .object({
      role: joi.string().valid("user", "admin").required().messages({
        "string.base": "Role should be a type of text",
        "string.empty": "Role cannot be an empty field",
        "any.only": "Entered role is not valid.",
        "any.required": "Role is required",
      }),
    })
    .required(),
};
