import multer, { diskStorage } from "multer";

export const fileUpload = () => {
  const fileFilter = (req, file, cb) => {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype))
      return cb(new Error("Invalid file type", { cause: 400 }), false);
    return cb(null, true);
  };
  return multer({ storage: diskStorage({}), fileFilter });
};
