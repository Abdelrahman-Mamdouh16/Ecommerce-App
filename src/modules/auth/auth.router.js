import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import * as authController from "./auth.controller.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import * as authSchema from "./auth.schema.js";
const authRouter = Router();

authRouter.post(
  "/register",
  validationMiddleware(authSchema.registerSchema),
  asyncHandler(authController.registerUser),
);
authRouter.get(
  "/confirm/:token",
  validationMiddleware(authSchema.activateAccountSchema),
  asyncHandler(authController.activateAccount),
);
// authRouter.get(
//   "/reconfirm/:token",
//   validationMiddleware(authSchema.activateAccountSchema),
//   asyncHandler(authController.reActivateAccount),
// );

authRouter.post(
  "/login",
  validationMiddleware(authSchema.loginSchema),
  asyncHandler(authController.loginUser),
);

authRouter.get(
  "/forgot-password-code/:email",
  validationMiddleware(authSchema.forgotPasswordSchema),
  asyncHandler(authController.forgotPasswordCode),
);
authRouter.post(
  "/reset-password",
  validationMiddleware(authSchema.resetPasswordSchema),
  asyncHandler(authController.resetPassword),
);

export default authRouter;
