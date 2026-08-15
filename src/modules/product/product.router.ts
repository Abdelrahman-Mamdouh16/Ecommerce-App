import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../utils/fileUploads/fileUpload.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import * as ProductSchema from "./product.schema.js";
import * as ProductController from "./product.controller.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

const productRouter = Router();

productRouter.get(
  "/getAllProducts",
  isAuthenticated,
  asyncHandler(ProductController.getAllProducts),
);
productRouter.get(
  "/getProductById/:productId",
  isAuthenticated,
  validationMiddleware(ProductSchema.getProductByIdSchema),
  asyncHandler(ProductController.getProductById),
);
productRouter.post(
  "/createProduct",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  fileUpload([
    { name: "defaultImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validationMiddleware(ProductSchema.createProductSchema),
  asyncHandler(ProductController.createProduct),
);
productRouter.patch(
  "/updateProduct/:productId",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  fileUpload([
    { name: "defaultImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validationMiddleware(ProductSchema.updateProductSchema),
  asyncHandler(ProductController.updateProduct),
);
productRouter.delete(
  "/deleteProduct/:productId",
  isAuthenticated,
  isAuthorized("admin", "seller"),
  validationMiddleware(ProductSchema.deleteProductSchema),
  asyncHandler(ProductController.deleteProduct),
);

export default productRouter;
