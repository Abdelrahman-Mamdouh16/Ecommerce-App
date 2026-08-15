import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import * as couponController from "./coupon.controller.js";
import * as couponSchema from "./coupon.schema.js";

const couponRouter = Router();

couponRouter.post(
	"/createCoupon",
	isAuthenticated,
	isAuthorized("admin","seller"),
	validationMiddleware(couponSchema.createCouponSchema),
	asyncHandler(couponController.createCoupon),
);

couponRouter.get(
	"/getAllCoupons",
	isAuthenticated,
	isAuthorized("admin"),
	asyncHandler(couponController.getAllCoupons),
);

couponRouter.get(
	"/getCouponById/:couponId",
	isAuthenticated,
	isAuthorized("admin","seller"),
	validationMiddleware(couponSchema.getCouponByIdSchema),
	asyncHandler(couponController.getCouponById),
);

couponRouter.patch(
	"/updateCoupon/:couponId",
	isAuthenticated,
	isAuthorized("admin","seller"),
	validationMiddleware(couponSchema.updateCouponSchema),
	asyncHandler(couponController.updateCoupon),
);

couponRouter.delete(
	"/deleteCoupon/:couponId",
	isAuthenticated,
	isAuthorized("seller","admin"),
	validationMiddleware(couponSchema.deleteCouponSchema),
	asyncHandler(couponController.deleteCoupon),
);

export default couponRouter;
