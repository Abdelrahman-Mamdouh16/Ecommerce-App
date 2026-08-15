import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { User } from "../DB/models/user.model.js";
import { Token } from "../DB/models/token.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization;

  // check token existence // check bearer key
  if (!token || !token.startsWith("Bearer ")) {
    return next(new Error("Token is missing or invalid", { cause: 401 }));
  }

  token = token.split(" ")[1];

  // check token in db
  const isTokenValid = await Token.findOne({
    token,
    isValid: true,
    expiredAt: { $gt: new Date() },
  });

  if (!isTokenValid) {
    return next(new Error("Token is invalid or expired", { cause: 401 }));
  }

  // extract payload
  const payload = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY as string,
  ) as jwt.JwtPayload & { id: string };

  if (!payload) {
    return next(new Error("Invalid token", { cause: 401 }));
  }

  // check user existence
  const currentUser = await User.findById(payload.id);

  if (!currentUser) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // pass user
  req.user = currentUser;

  // go to next middleware
  next();
});
