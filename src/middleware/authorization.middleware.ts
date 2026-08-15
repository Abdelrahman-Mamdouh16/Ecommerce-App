import type { Request, Response, NextFunction } from "express";

export const isAuthorized = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!role.includes(req.user.role)) {
      return next(
        new Error("You are not authorized to access this resource", {
          cause: 403,
        }),
      );
    }

    return next();
  };
};