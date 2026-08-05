import joi from "joi";

export const createCategorySchema = {
  body: joi
    .object({
      name: joi.string().min(3).max(30).required().messages({
        "string.base": "Category name should be a type of 'text'",
        "string.empty": "Category name cannot be an empty field",
        "string.min": "Category name should have a minimum length of 3",
        "string.max": "Category name should have a maximum length of 30",
        "any.required": "Category name is a required field",
      }),
    })
    .required(),
};
