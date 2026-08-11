import slugify from "slugify";
import { Category } from "../../DB/models/category.model.js";
import cloudinary from "../../utils/fileUploads/cloud.js";
import { Subcategory } from "../../DB/models/subcategory.model.js";

export const createSubcategory = async (req, res, next) => {
  // check if the category image is provided
  const { name } = req.body;
  const { category_Id } = req.params;

  if (!req.file)
    return next(new Error("Subcategory image is required", { cause: 400 }));
  // upload the image to cloudinary
  const isCategoryExist = await Category.findById(category_Id);
  if (!isCategoryExist) {
    return next(new Error("Category not found", { cause: 404 }));
  }
  const slug = slugify(name, { lower: true });
  const isSubcategoryExist = await Subcategory.findOne({
    slug,
  });

  if (isSubcategoryExist) {
    return next(
      new Error("'name' of Subcategory already exists", { cause: 400 }),
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/subcategory`,
    },
  );
  // create the subcategory in the database
  const newSubcategory = await Subcategory.create({
    name: req.body.name,
    slug,
    categoryId: category_Id,
    createdBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });
  // send the response
  return res.status(201).json({
    success: true,
    message: "Subcategory created successfully",
    data: newSubcategory,
  });
};

export const getAllSubcategories = async (req, res, next) => {
  const subcategories = await Subcategory.find().populate("categoryId");
  return res.status(200).json({
    success: true,
    message: "Subcategories retrieved successfully",
    data: subcategories,
  });
};

export const getSubcategoryById = async (req, res, next) => {
  const { subcategory_Id } = req.params;
  const isSubcategoryExist =
    await Subcategory.findById(subcategory_Id).populate("categoryId");
  if (!isSubcategoryExist) {
    return next(new Error("Subcategory not found", { cause: 404 }));
  }
  return res.status(200).json({
    success: true,
    message: "Subcategory retrieved successfully",
    data: isSubcategoryExist,
  });
};

export const updateSubcategory = async (req, res, next) => {
  const { subcategory_Id } = req.params;
  const { name } = req.body;

  // Check if subcategory exists
  const subcategory = await Subcategory.findById(subcategory_Id);

  if (!subcategory) {
    return next(new Error("Subcategory not found", { cause: 404 }));
  }

  // Check authorization
  if (!req.user._id.equals(subcategory.createdBy)) {
    return next(
      new Error("You are not authorized to update this subcategory", {
        cause: 403,
      }),
    );
  }

  // Update name and slug
  if (name !== subcategory.name) {
    const slug = slugify(name, { lower: true });

    // Check if another subcategory already uses this slug
    const isSlugExist = await Subcategory.findOne({
      slug,
      _id: { $ne: subcategory_Id },
    });

    if (isSlugExist) {
      return next(new Error("Subcategory name already exists", { cause: 400 }));
    }

    subcategory.name = name;
    subcategory.slug = slug;
  }

  // Update image if provided
  if (req.file) {
    const oldImageId = subcategory.image.id;

    // Delete old image
    await cloudinary.uploader.destroy(oldImageId);

    // Upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/subcategory`,
      },
    );

    subcategory.image = {
      id: public_id,
      url: secure_url,
    };
  }

  // Save changes
  await subcategory.save();

  return res.status(200).json({
    success: true,
    message: "Subcategory updated successfully",
    data: subcategory,
  });
};

export const deleteSubcategory = async (req, res, next) => {
  const { subcategory_Id } = req.params;
  const isSubcategoryExist = await Subcategory.findById(subcategory_Id);
  if (!isSubcategoryExist) {
    return next(new Error("Subcategory not found", { cause: 404 }));
  }
  if (!req.user._id.equals(isSubcategoryExist.createdBy))
    return next(
      new Error("You are not authorized to delete this subcategory", {
        cause: 403,
      }),
    );
  await cloudinary.uploader.destroy(isSubcategoryExist.image.id);
  await isSubcategoryExist.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Subcategory deleted successfully",
  });
};
