import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import * as cartController from "./cart.controller.js";
import * as cartSchema from "./cart.schema.js";

const cartRouter = Router();
// Create Cart
cartRouter.post(
  "/addToCart",
  isAuthenticated,
  isAuthorized("user","admin","seller"),
  validationMiddleware(cartSchema.addToCartSchema),
  asyncHandler(cartController.addToCart),
);

cartRouter.get(
  "/getUserCart",
  isAuthenticated,
  isAuthorized("user","admin"),
  asyncHandler(cartController.getUserCart),
);

// update Cart
cartRouter.patch(
  "/updateCart/:productId",
  isAuthenticated,
  isAuthorized("user"),
  validationMiddleware(cartSchema.updateCartSchema),
  asyncHandler(cartController.updateCart),
);

// delete Cart
cartRouter.delete(
  "/removeFromCart/:productId",
  isAuthenticated,
  isAuthorized("user","admin"),
  validationMiddleware(cartSchema.removeFromCartSchema),
  asyncHandler(cartController.removeFromCart),
);
cartRouter.delete(
  "/clearCart",
  isAuthenticated,
  isAuthorized("user","admin"),
  asyncHandler(cartController.clearCart),
);

export default cartRouter;
