export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      return next(
        new Error(
          validationResult.error.details.map((err) => err.message).join(", "),
          { cause: 400 },
        ),
      );
    }
    return next();
  };
};
