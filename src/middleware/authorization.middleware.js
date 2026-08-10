export const isAuthorized = (...role) => {
  return async (req, res, next) => {
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
