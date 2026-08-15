import type { Request, Response, NextFunction } from "express";

export const validationMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

      const { error } = schema[section].validate(req[section as keyof Request], {
        abortEarly: false,
      });

      if (error) {
        return next(
          new Error(error.details.map((err: any) => err.message).join(", "), {
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