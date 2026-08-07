import slugify from "slugify";
import { Category } from "../../DB/models/category.model.js";
import cloudinary from "../../utils/fileUploads/cloud.js";

export const createCategory = async (req, res, next) => {
  // check if the category image is provided
  const { name } = req.body;
  if (!req.file)
    return next(new Error("Category image is required", { cause: 400 }));
  // upload the image to cloudinary

  const slug = slugify(name, { lower: true });
  const isCategoryExist = await Category.findOne({
    // name: req.body.name||
    slug,
  });
  // console.log(req.body.name);
  // console.log(slug);
  // console.log(isCategoryExist);

  if (isCategoryExist) {
    return next(new Error("'name' of Category already exists", { cause: 400 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/category`,
    },
  );
  // create the category in the database
  const newCategory = await Category.create({
    name,
    slug,
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });
  // send the response
  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
};

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const isCategoryExist = await Category.findById(categoryId);
  if (!isCategoryExist) {
    return next(new Error("Category not found", { cause: 404 }));
  }
  if (!req.user._id.equals(isCategoryExist.createdBy))
    return next(
      new Error("You are not authorized to update this category", {
        cause: 403,
      }),
    );
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: isCategoryExist.image.id },
    );
    isCategoryExist.image = { id: public_id, url: secure_url };
  }
  isCategoryExist.name = req.body.name ? req.body.name : isCategoryExist.name;
  isCategoryExist.slug = req.body.name
    ? slugify(req.body.name, { lower: true })
    : isCategoryExist.slug;
  await isCategoryExist.save();
  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: isCategoryExist,
  });
};
export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const isCategoryExist = await Category.findById(categoryId);
  if (!isCategoryExist) {
    return next(new Error("Category not found", { cause: 404 }));
  }
  if (!req.user._id.equals(isCategoryExist.createdBy))
    return next(
      new Error("You are not authorized to delete this category", {
        cause: 403,
      }),
    );
  await cloudinary.uploader.destroy(isCategoryExist.image.id);
  await isCategoryExist.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};
export const getCategoryById = async (req, res, next) => {
  const { categoryId } = req.params;
  const isCategoryExist = await Category.findById(categoryId).populate("subcategories");
  if (!isCategoryExist) {
    return next(new Error("Category not found", { cause: 404 }));
  }
  return res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: isCategoryExist,
  });
};
export const getAllCategories = async (req, res, next) => {
  const categories = await Category.find();
  return res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
};
