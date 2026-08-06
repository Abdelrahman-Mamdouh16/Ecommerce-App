import joi from "joi";
import { isValidObjectId } from "mongoose";

export const createCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(3).max(30).required().messages({
        "string.base": "'name' of category should be a type of 'text'",
        "string.empty": "'name' of category cannot be an empty field",
        "string.min": "'name' of category should have a minimum length of 3",
        "string.max": "'name' of category should have a maximum length of 30",
        "any.required": "'name' of category is a required field",
      }),
    })
    .required(),
};
export const updateCategorySchema = {
  params: joi
    .object({
      categoryId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message("Invalid category ID");
          return value;
        })
        .required(),
    })
    .required(),
  body: joi
    .object({
      name: joi.string().min(3).max(30).required().messages({
        "string.base": "'name' of category should be a type of 'text'",
        "string.empty": "'name' of category cannot be an empty field",
        "string.min": "'name' of category should have a minimum length of 3",
        "string.max": "'name' of category should have a maximum length of 30",
        "any.required": "'name' of category is a required field",
      }),
    })
    .required(),
};
export const deleteCategorySchema = {
  params: joi
    .object({
      categoryId: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message("Invalid category ID");
          return value;
        })
        .required(),
    })
    .required(),
};
