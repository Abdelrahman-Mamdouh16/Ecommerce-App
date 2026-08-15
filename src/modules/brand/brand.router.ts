import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUploads/fileUpload.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import * as brandController from "./brand.controller.js";
import * as brandSchema from "./brand.schema.js";

const brandRouter = Router();
// POST   /createBrand
brandRouter.post(
  "/createBrand",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("brand"),
  validationMiddleware(brandSchema.createBrandSchema),
  asyncHandler(brandController.createBrand),
);
// GET    /getAllBrands
brandRouter.get(
  "/getAllBrands",
  isAuthenticated,
  asyncHandler(brandController.getAllBrands),
);
// GET    /getBrand/:brand_Id
brandRouter.get(
  "/getBrandById/:brand_Id",
  isAuthenticated,
  validationMiddleware(brandSchema.getBrandByIdSchema),
  asyncHandler(brandController.getBrandById),
);
// PATCH  /updateBrand/:brand_Id
brandRouter.patch(
  "/updateBrandById/:brand_Id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("brand"),
  validationMiddleware(brandSchema.updateBrandByIdSchema),
  asyncHandler(brandController.updateBrandById),
);
// DELETE /deleteBrand/:brand_Id
brandRouter.delete(
  "/deleteBrandById/:brand_Id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload("brand"),
  validationMiddleware(brandSchema.deleteBrandByIdSchema),
  asyncHandler(brandController.deleteBrandById),
);

export default brandRouter;
