import multer, { diskStorage } from "multer";

// export const fileUpload = () => {
//   const fileFilter = (req, file, cb) => {
//     if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype))
//       return cb(new Error("Invalid file type", { cause: 400 }), false);
//     return cb(null, true);
//   };
//   return multer({ storage: diskStorage({}), fileFilter });
// };

export const fileUpload = (fieldName) => {
  const fileFilter = (req, file, cb) => {
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      return cb(new Error("Invalid file type", { cause: 400 }), false);
    }

    return cb(null, true);
  };

  const upload = multer({
    storage: diskStorage({}),
    fileFilter,
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return next(
            new Error(
              `Please upload the file using the '${fieldName}' field.`,
              {
                cause: 400,
              },
            ),
          );
        }

        return next(err);
      }

      return next();
    });
  };
};
