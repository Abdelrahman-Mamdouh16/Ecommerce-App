export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const sections = ["params", "body", "query"];
    if (!sections.some((section) => schema[section])) {
      return next(
        new Error(
          `Developer Error: Invalid validation schema. Schema must contain at least one of: body, params, or query.`,
          { cause: 500 },
        ),
      );
    }

    for (const section of sections) {
      if (!schema[section]) continue;

      const { error } = schema[section].validate(req[section], {
        abortEarly: false,
      });

      if (error) {
        return next(
          new Error(error.details.map((err) => err.message).join(", "), {
            cause: 400,
          }),
        );
      }
    }

    return next();
  };
};
// export const isValidObjectId = (id) => {
//   if (!Types.ObjectId.isValid(id)) return false;

//   return true;
// };
