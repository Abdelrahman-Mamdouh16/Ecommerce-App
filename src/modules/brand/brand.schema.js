import joi from "joi";
import { isValidObjectId } from "mongoose";

export const createBrandSchema = {
  body: joi
    .object({
      name: joi.string().min(3).max(30).required().messages({
        "string.base": "Brand name should be a string",
        "string.empty": "Brand name is required",
        "string.min": "Brand name should be at least 3 characters",
        "string.max": "Brand name should not exceed 30 characters",
      }),
    })
    .required(),
};

export const getBrandByIdSchema = {
  params: joi
    .object({
      brand_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message("Invalid brand ID");
          return value;
        })
        .required()
        .messages({
          "string.base": "Brand Id should be a objectId",
          "string.empty": "Brand Id is required",
          "any.required": "Brand Id is required",
        }),
    })
    .required(),
};

export const updateBrandByIdSchema = {
  params: joi
    .object({
      brand_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message("Invalid brand ID");
          return value;
        })
        .required()
        .messages({
          "string.base": "Brand Id should be a objectId",
          "string.empty": "Brand Id is required",
          "any.required": "Brand Id is required",
        }),
    })
    .required(),
  body: joi
    .object({
      name: joi.string().min(3).max(30).messages({
        "string.base": "Brand name should be a string",
        "string.empty": "Brand name is required",
        "string.min": "Brand name should be at least 3 characters",
        "string.max": "Brand name should not exceed 30 characters",
      }),
    })
    .required(),
};

export const deleteBrandByIdSchema = {
  params: joi
    .object({
      brand_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message("Invalid brand ID");
          return value;
        })
        .required()
        .messages({
          "string.base": "Brand Id should be a objectId",
          "string.empty": "Brand Id is required",
          "any.required": "Brand Id is required",
        }),
    })
    .required(),
};
