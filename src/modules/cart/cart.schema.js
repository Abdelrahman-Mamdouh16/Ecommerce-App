import joi from "joi";
import { isValidObjectId } from "mongoose";

const productIdSchema = joi
  .string()
  .custom((value, helpers) => {
    if (isValidObjectId(value) === false) {
      return helpers.message("Invalid product ID");
    }

    return value;
  })
  .messages({
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID cannot be empty",
    "any.invalid": "Invalid product ID",
    "any.custom": "Invalid product ID",
    "custom.empty": "Product ID cannot be empty",
  });

export const addToCartSchema = {
  body: joi
    .object({
      productId: productIdSchema.required().messages({
        "any.required": "Product ID is required",
      }),

      quantity: joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
        "number.empty": "Quantity cannot be empty",
      }),
    })
    .required()
    .messages({
      "object.base": "Request body must be an object",
      "any.required": "Request body is required",
      "object.empty": "Request body cannot be empty",
    }),
};
export const updateCartSchema = {
  params: joi
    .object({
      productId: productIdSchema.required().messages({
        "any.required": "Product ID is required",
      }),
    })
    .required()
    .messages({
      "object.base": "Request params must be an object",
      "any.required": "Request params is required",
      "object.empty": "Request params cannot be empty",
    }),

  body: joi
    .object({
      quantity: joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
        "number.empty": "Quantity cannot be empty",
      }),
    })
    .required()
    .messages({
      "object.base": "Request body must be an object",
      "any.required": "Request body is required",
      "object.empty": "Request body cannot be empty",
    }),
};

export const removeFromCartSchema = {
  params: joi
    .object({
      productId: productIdSchema.required().messages({
        "any.required": "Product ID is required",
      }),
    })
    .required()
    .messages({
      "object.base": "Request params must be an object",
      "any.required": "Request params is required",
      "object.empty": "Request params cannot be empty",
    }),
};
