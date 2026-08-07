import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as categoryController from "./category.controller.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import { fileUpload } from "../../utils/fileUploads/fileUpload.js";
import * as categorySchema from "./category.schema.js";

const categoryRouter = Router();

// Create Category
categoryRouter.post(
  "/createCategory",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("category"),
  validationMiddleware(categorySchema.createCategorySchema),
  asyncHandler(categoryController.createCategory),
);

// Get All Categories or specific category by ID
categoryRouter.get(
  "/getAllCategories",
  isAuthenticated,
  // isAuthorized("admin"),
  // validationMiddleware(categorySchema.deleteCategorySchema),
  asyncHandler(categoryController.getAllCategories),
);
categoryRouter.get(
  "/getCategory/:categoryId",
  isAuthenticated,
  // isAuthorized("admin"),
  validationMiddleware(categorySchema.getCategoryByIdSchema),
  asyncHandler(categoryController.getCategoryById),
);

// update Category
categoryRouter.patch(
  "/updateCategory/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("category"),
  validationMiddleware(categorySchema.updateCategorySchema),
  asyncHandler(categoryController.updateCategory),
);

// delete Category
categoryRouter.delete(
  "/deleteCategory/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(categorySchema.deleteCategorySchema),
  asyncHandler(categoryController.deleteCategory),
);

export default categoryRouter;
