import slugify from "slugify";
import { Brand } from "../../DB/models/brand.model.js";
import cloudinary from "../../utils/fileUploads/cloud.js";
import type { Request, Response, NextFunction } from "express";

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // name
  const { name } = req.body;
  // check image
  if (!req.file)
    return next(new Error("Brand image is required", { cause: 400 }));
  // generate slug
  const slug = slugify(name, { lower: true });
  // check duplicate name/slug
  const isBrandExist = await Brand.findOne({ slug });
  if (isBrandExist)
    return next(new Error("Brand already exists", { cause: 400 }));
  // upload image to Cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/brand` },
  );
  // create Brand
  const newBrand = await Brand.create({
    name,
    slug,
    image: { secure_url, public_id },
    createdBy: req.user._id,
  });
  // return 201
  return res.status(201).json({
    success: true,
    message: "Brand created successfully",
    data: newBrand,
  });
};

export const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const allBrands = await Brand.find();
  return res
    .status(200)
    .json({ success: true, message: "All Brands", data: allBrands });
};

export const getBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { brand_Id } = req.params;
  const isExistBrand = await Brand.findById(brand_Id);
  if (!isExistBrand) return next(new Error("Brand not found", { cause: 404 }));
  return res.status(200).json({
    success: true,
    message: "Brand retrieved successfully",
    data: isExistBrand,
  });
};
export const updateBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { brand_Id } = req.params;
  const { name } = req.body;

  // Find Brand
  const brand = await Brand.findById(brand_Id);

  // Check if Brand exists
  if (!brand) {
    return next(new Error("Brand not found", { cause: 404 }));
  }

  // Check authorization
  if (!req.user._id.equals(brand.createdBy)) {
    return next(
      new Error("Unauthorized to update this brand", {
        cause: 403,
      }),
    );
  }

  // Update name and slug
  if (name) {
    const slug = slugify(name, { lower: true });

    // Check duplicate Brand
    const isBrandExist = await Brand.findOne({
      slug,
      _id: { $ne: brand_Id },
    });

    if (isBrandExist) {
      return next(
        new Error("Brand already exists", {
          cause: 400,
        }),
      );
    }

    brand.name = name;
    brand.slug = slug;
  }

  // Update image
  if (req.file) {
    if (!brand.image) {
      return next(new Error("Brand image not found", { cause: 404 }));
    }
    const oldImageId = brand.image.public_id;

    // Delete old image
    await cloudinary.uploader.destroy(oldImageId);

    // Upload new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/brand`,
      },
    );

    brand.image = {
      public_id: public_id,
      secure_url: secure_url,
    };
  }
  // Save changes
  await brand.save();

  return res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    data: brand,
  });
};

export const deleteBrandById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { brand_Id } = req.params;

  // Find Brand
  const brand = await Brand.findById(brand_Id);

  // Check if Brand exists
  if (!brand) {
    return next(new Error("Brand not found", { cause: 404 }));
  }

  // Check authorization
  if (!req.user._id.equals(brand.createdBy)) {
    return next(
      new Error("Unauthorized to delete this brand", {
        cause: 403,
      }),
    );
  }

  // Delete Brand
  await brand.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
  });
};
