import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import * as userController from "./user.controller.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";
import { updateUserRoleSchema } from "./user.schema.js";

const userRouter = Router();

// Create user 

// Get All user or specific user by ID

// update user
userRouter.patch(
  "/updateUserRole/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validationMiddleware(updateUserRoleSchema),
  asyncHandler(userController.updateUserRole),
);

// delete user

export default userRouter;
