import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import * as orderController from "./order.controller.js";
import * as orderSchema from "./order.schema.js";

const orderRouter = Router();

// User order flow: create an order from the authenticated user's cart.
orderRouter.post(
  "/createOrder",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validationMiddleware(orderSchema.createOrderSchema),
  asyncHandler(orderController.createOrder),
);

orderRouter.get(
  "/getMyOrders",
  isAuthenticated,
  isAuthorized("user", "admin"),
  asyncHandler(orderController.getMyOrders),
);

orderRouter.get(
  "/getOrderById/:orderId",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validationMiddleware(orderSchema.getOrderByIdSchema),
  asyncHandler(orderController.getOrderById),
);

orderRouter.patch(
  "/cancelOrder/:orderId",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validationMiddleware(orderSchema.cancelOrderSchema),
  asyncHandler(orderController.cancelOrder),
);

// Admin routes.
orderRouter.get(
  "/getAllOrders",
  isAuthenticated,
  isAuthorized("admin"),
  asyncHandler(orderController.getAllOrders),
);

orderRouter.get(
  "/getOrderByIdAdmin/:orderId",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(orderSchema.getOrderByIdSchema),
  asyncHandler(orderController.getOrderById),
);

orderRouter.patch(
  "/updateOrderStatus/:orderId",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(orderSchema.updateOrderStatusSchema),
  asyncHandler(orderController.updateOrderStatus),
);

// Helpful aliases to match the requested REST-style order endpoints.
orderRouter.post(
  "/",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validationMiddleware(orderSchema.createOrderSchema),
  asyncHandler(orderController.createOrder),
);

orderRouter.get(
  "/",
  isAuthenticated,
  isAuthorized("user", "admin"),
  asyncHandler(orderController.getMyOrders),
);

orderRouter.get(
  "/admin",
  isAuthenticated,
  isAuthorized("admin"),
  asyncHandler(orderController.getAllOrders),
);

orderRouter.get(
  "/admin/:orderId",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(orderSchema.getOrderByIdSchema),
  asyncHandler(orderController.getOrderById),
);

orderRouter.patch(
  "/:orderId/cancel",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validationMiddleware(orderSchema.cancelOrderSchema),
  asyncHandler(orderController.cancelOrder),
);

orderRouter.patch(
  "/admin/:orderId/status",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(orderSchema.updateOrderStatusSchema),
  asyncHandler(orderController.updateOrderStatus),
);

export default orderRouter;
