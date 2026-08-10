import joi from "joi";
import { isValidObjectId } from "mongoose";

export const createCouponSchema = {
  body: joi
    .object({
      name: joi.string().trim().min(3).max(50).messages({
        "string.base": "Coupon name should be a string",
        "string.min": "Coupon name should be at least 3 characters",
        "string.max": "Coupon name should not exceed 50 characters",
      }),
      discount: joi.number().integer().min(0).max(100).required().messages({
        "number.base": "Discount should be a number",
        "number.min": "Discount should be at least 0",
        "number.max": "Discount should not exceed 100",
        "number.integer": "Discount should be an integer",
        "any.required": "Discount is required",
      }),
      expiredAt: joi.date().greater("now").required().messages({
        "date.base": "Expired date should be a valid date",
        "date.greater": "Expired date must be in the future",
        "any.required": "Expired date is required",
      }),
    })
    .required(),
};

export const getCouponByIdSchema = {
  params: joi
    .object({
      couponId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message("Invalid coupon ID");
          }
          return value;
        })
        .required(),
    })
    .required(),
};

export const updateCouponSchema = {
  params: joi
    .object({
      couponId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message("Invalid coupon ID");
          }
          return value;
        })
        .required(),
    })
    .required(),
  body: joi
    .object({
      name: joi.string().trim().min(3).max(50).messages({
        "string.base": "Coupon name should be a string",
        "string.empty": "Coupon name is required",
        "string.min": "Coupon name should be at least 3 characters",
        "string.max": "Coupon name should not exceed 50 characters",
      }),
      discount: joi.number().integer().min(1).max(100).messages({
        "number.base": "Discount should be a number",
        "number.min": "Discount should be at least 1",
        "number.max": "Discount should not exceed 100",
      }),
      expiredAt: joi.date().greater("now").messages({
        "date.base": "Expired date should be a valid date",
        "date.greater": "Expired date must be in the future",
      }),
    })
    .min(1)
    .required()
    .messages({
      "any.required": "Request body is required",
      "object.min":
        "At least one field (name, discount, or expiredAt) must be provided for update",
      "object.empty": "Request body cannot be empty",
    }),
};

export const deleteCouponSchema = {
  params: joi
    .object({
      couponId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message("Invalid coupon ID");
          }
          return value;
        })
        .required(),
    })
    .required(),
};
