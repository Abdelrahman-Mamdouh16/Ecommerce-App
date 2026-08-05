export const createCategory = (req, res, next) => {
    if (!req.file) return next(new Error("Category image is required", { cause: 400 }));
};
