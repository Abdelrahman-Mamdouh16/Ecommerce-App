import joi from "joi";
import { isValidObjectId } from "mongoose";

export const createProductSchema = {
  body: joi
    .object({
      name: joi.string().max(100).min(2).required().messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name is required",
        "string.max":
          "Product name must be less than or equal to 100 characters",
        "string.min":
          "Product name must be greater than or equal to 2 characters",
        "any.required": "Product name is required",
      }),
      description: joi.string().required().messages({
        "string.base": "Product description must be a string",
        "string.empty": "Product description is required",
        "any.required": "Product description is required",
      }),
      price: joi
        .number()
        .integer()
        .optional()
        .min(1)
        .required()
        .messages({
          "number.base": "Product price must be a number",
          "number.empty": "Product price is required",
          "any.required": "Product price is required",
          "number.min": "Product price must be greater than or equal to 1",
        }),
      quantity: joi
        .number()
        .integer()
        .optional()
        .min(0)
        .required()
        .messages({
          "number.base": "Product quantity must be a number",
          "number.empty": "Product quantity is required",
          "any.required": "Product quantity is required",
          "number.min": "Product quantity must be greater than or equal to 0",
        }),
      discount: joi.number().optional().messages({
        "number.base": "Product discount must be a number",
      }),
      category: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({ custom: "Product category must be a valid ObjectId" });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Product category must be a string",
          "string.empty": "Product category is required",
          "any.required": "Product category is required",
        }),
      subcategory: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({
              custom: "Product sub-category must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Product sub-category must be a string",
          "string.empty": "Product sub-category is required",
          "any.required": "Product sub-category is required",
        }),
      brand: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({
              custom: "Product brand must be a valid ObjectId",
            });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Product brand must be a string",
          "string.empty": "Product brand is required",
          "any.required": "Product brand is required",
        }),
    })
    .required(),
};

export const getProductByIdSchema = {
  params: joi
    .object({
      productId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({ custom: "Product ID must be a valid ObjectId" });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Product ID must be a string",
          "string.empty": "Product ID is required",
          "any.required": "Product ID is required",
        }),
    })
    .required(),
};
// export const getAllProductsSchema = {
//   query: joi.object({
//     keyword: joi.string().messages({
//       "string.base": "Product keyword must be a string",
//       "string.empty": "Product keyword is empty please Enter text to search",
//       // "any.required": "Product keyword is required",
//     }),
//   }),
//   // .required(),
// };

export const updateProductSchema = {
  body: joi
    .object({
      name: joi.string().max(100).min(2).optional().messages({
        "string.base": "Product name must be a string",
        "string.empty": "Product name is required",
        "string.max":
          "Product name must be less than or equal to 100 characters",
        "string.min":
          "Product name must be greater than or equal to 2 characters",
        "any.required": "Product name is required",
      }),
      description: joi.string().messages({
        "string.base": "Product description must be a string",
        "string.empty": "Product description is required",
        "any.required": "Product description is required",
      }),
      price: joi
        .number()
        .integer()
        .optional()
        .min(1)
        .required()
        .messages({
          "number.base": "Product price must be a number",
          "number.empty": "Product price is required",
          "any.required": "Product price is required",
          "number.min": "Product price must be greater than or equal to 1",
        }),
      quantity: joi
        .number()
        .integer()
        .optional()
        .min(0)

        .messages({
          "number.base": "Product quantity must be a number",
          "number.empty": "Product quantity is required",
          "any.required": "Product quantity is required",
          "number.min": "Product quantity must be greater than or equal to 0",
        }),
      discount: joi.number().optional().messages({
        "number.base": "Product discount must be a number",
      }),
      category: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({ custom: "Product category must be a valid ObjectId" });
          }
          return value;
        })
        .messages({
          "string.base": "Product category must be a string",
          "string.empty": "Product category is required",
          "any.required": "Product category is required",
        }),
      subcategory: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({
              custom: "Product sub-category must be a valid ObjectId",
            });
          }
          return value;
        })
        .messages({
          "string.base": "Product sub-category must be a string",
          "string.empty": "Product sub-category is required",
          "any.required": "Product sub-category is required",
        }),
      brand: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({ custom: "Product brand must be a valid ObjectId" });
          }
          return value;
        })
        .messages({
          "string.base": "Product brand must be a string",
          "string.empty": "Product brand is required",
          "any.required": "Product brand is required",
        }),
    })
    .required()
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update",
    }),
  params: joi
    .object({
      productId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({ custom: "Product ID must be a valid ObjectId" });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Product ID must be a string",
          "string.empty": "Product ID is required",
          "any.required": "Product ID is required",
        }),
    })
    .required(),
};

export const deleteProductSchema = {
  params: joi
    .object({
      productId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false) {
            return helpers.message({ custom: "Product ID must be a valid ObjectId" });
          }
          return value;
        })
        .required()
        .messages({
          "string.base": "Product ID must be a string",
          "string.empty": "Product ID is required",
          "any.required": "Product ID is required",
        }),
    })
    .required(),
};
