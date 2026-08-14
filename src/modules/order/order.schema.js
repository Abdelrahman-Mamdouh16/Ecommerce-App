import joi from "joi";
import { isValidObjectId } from "mongoose";

const objectIdSchema = joi.string().custom((value, helpers) => {
  if (isValidObjectId(value) === false) {
    return helpers.message("Invalid ObjectId");
  }

  return value;
});

export const createOrderSchema = {
  body: joi
    .object({
      address: joi.string().trim().min(5).max(200).required().messages({
        "string.base": "Address must be a string",
        "string.empty": "Address is required",
        "string.min": "Address must be at least 5 characters",
        "string.max": "Address must not exceed 200 characters",
        "any.required": "Address is required",
      }),
      phone: joi.string().trim().min(7).max(20).required().messages({
        "string.base": "Phone must be a string",
        "string.empty": "Phone is required",
        "string.min": "Phone must be at least 7 characters",
        "string.max": "Phone must not exceed 20 characters",
        "any.required": "Phone is required",
      }),
      payment: joi.string().valid("cash", "visa").default("cash").messages({
        "any.only": "Payment method must be either cash or visa",
      }),
      couponCode: joi.string().trim().min(3).max(50).messages({
        "string.base": "Coupon code must be a string",
        "string.min": "Coupon code must be at least 3 characters",
        "string.max": "Coupon code must not exceed 50 characters",
      }),
    })
    .required()
    .messages({
      "any.required": "Request body is required",
      "object.base": "Request body must be an object",
    }),
};

export const getOrderByIdSchema = {
  params: joi
    .object({
      orderId: objectIdSchema.required().messages({
        "any.required": "Order ID is required",
      }),
    })
    .required(),
};

export const cancelOrderSchema = {
  params: joi
    .object({
      orderId: objectIdSchema.required().messages({
        "any.required": "Order ID is required",
      }),
    })
    .required(),
};

export const updateOrderStatusSchema = {
  params: joi
    .object({
      orderId: objectIdSchema.required().messages({
        "any.required": "Order ID is required",
      }),
    })
    .required(),
  body: joi
    .object({
      status: joi
        .string()
        .valid("placed", "confirmed", "shipped", "delivered", "cancelled", "refunded")
        .required()
        .messages({
          "any.only": "Status must be one of: placed, confirmed, shipped, delivered, cancelled, refunded",
          "any.required": "Status is required",
        }),
    })
    .required()
    .messages({
      "any.required": "Request body is required",
      "object.base": "Request body must be an object",
    }),
};
