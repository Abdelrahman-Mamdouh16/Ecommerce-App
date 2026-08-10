import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import { fileUpload } from "../../utils/fileUploads/fileUpload.js";
import * as subcategorySchema from "./subcategory.schema.js";
import * as categoryController from "./subcategory.controller.js";

const subcategoryRouter = Router({ mergeParams: true });

// Create Subcategory
subcategoryRouter.post(
  "/createSubcategory",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("subcategory"),
  validationMiddleware(subcategorySchema.createSubcategorySchema),
  asyncHandler(categoryController.createSubcategory),
);

// Get All Subcategories or specific subcategory by ID
subcategoryRouter.get(
  "/getAllSubcategories",
  isAuthenticated,
  // isAuthorized("admin"),
  // validationMiddleware(categorySchema.deleteCategorySchema),
  asyncHandler(categoryController.getAllSubcategories),
);

subcategoryRouter.get(
  "/getSubcategory/:subcategory_Id",
  isAuthenticated,
  // isAuthorized("admin"),
  validationMiddleware(subcategorySchema.getSubcategoryByIdSchema),
  asyncHandler(categoryController.getSubcategoryById),
);

// update Subcategory
subcategoryRouter.patch(
  "/updateSubcategory/:subcategory_Id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("subcategory"),
  validationMiddleware(subcategorySchema.updateSubcategorySchema),
  asyncHandler(categoryController.updateSubcategory),
);

// delete Subcategory
subcategoryRouter.delete(
  "/deleteSubcategory/:subcategory_Id",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(subcategorySchema.deleteSubcategorySchema),
  asyncHandler(categoryController.deleteSubcategory),
);

export default subcategoryRouter;
