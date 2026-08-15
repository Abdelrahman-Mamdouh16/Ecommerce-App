import joi from "joi";
import { isValidObjectId } from "mongoose";

export const createSubcategorySchema = {
  prams: joi
    .object({
      category_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid category ID it should be a valid ObjectId" }
            );
          return value;
        })
        .required()
        .messages({
          "string.base":
            "'categoryId' of Subcategory should be a type of 'text'",
          "string.empty":
            "'categoryId' of Subcategory cannot be an empty field",
          "any.required": "'categoryId' of Subcategory is a required field",
        }),
    })
    .required(),
  body: joi
    .object({
      name: joi.string().min(3).max(30).required().messages({
        "string.base": "'name' of Subcategory should be a type of 'text'",
        "string.empty": "'name' of Subcategory cannot be an empty field",
        "string.min": "'name' of Subcategory should have a minimum length of 3",
        "string.max":
          "'name' of Subcategory should have a maximum length of 30",
        "any.required": "'name' of Subcategory is a required field",
      }),
    })
    .required(),
};
export const getSubcategoryByIdSchema = {
  params: joi
    .object({
      subcategory_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid subcategory ID it should be a valid ObjectId" },
            );
          return value;
        })
        .required(),
      category_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid category ID it should be a valid ObjectId" },
            );
          return value;
        })
        .required(),
    })
    .required(),
};
export const updateSubcategorySchema = {
  params: joi
    .object({
      subcategory_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid subcategory ID it should be a valid ObjectId" },
            );
          return value;
        })
        .required(),
      category_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid category ID it should be a valid ObjectId" },
            );
          return value;
        })
        .required(),
    })
    .required(),
  body: joi
    .object({
      name: joi.string().min(3).max(30).messages({
        "string.base": "'name' of subcategory should be a type of 'text'",
        "string.min": "'name' of subcategory should have a minimum length of 3",
        "string.max":
          "'name' of subcategory should have a maximum length of 30",
      }),
    })
    .required(),
};
export const deleteSubcategorySchema = {
  params: joi
    .object({
      subcategory_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid subcategory ID it should be a valid ObjectId" },
            );
          return value;
        })
        .required(),
      category_Id: joi
        .string()
        .custom((value, helpers) => {
          if (isValidObjectId(value) === false)
            return helpers.message(
              { custom: "Invalid category ID it should be a valid ObjectId" },
            );
          return value;
        })
        .required(),
    })
    .required(),
};
