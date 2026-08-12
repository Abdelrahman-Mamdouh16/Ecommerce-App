import { nanoid } from "nanoid";
import { Brand } from "../../DB/models/brand.model.js";
import { Category } from "../../DB/models/category.model.js";
import { Subcategory } from "../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/fileUploads/cloud.js";
import { Product } from "../../DB/models/product.model.js";

export const createProduct = async (req, res, next) => {
  const { category, subcategory, brand } = req.body;
  const isExistCategory = await Category.findById(category);
  if (!isExistCategory)
    return next(new Error("Invalid category id", { cause: 400 }));
  const isExistSubCategory = await Subcategory.findById(subcategory);
  if (!isExistSubCategory)
    return next(new Error("Invalid sub-category id", { cause: 400 }));
  const isExistBrand = await Brand.findById(brand);
  if (!isExistBrand) return next(new Error("Invalid brand id", { cause: 400 }));

  if (!req.files.defaultImage)
    return next(new Error("Default image is required", { cause: 400 }));
  if (!req.files.images || req.files.images.length === 0)
    return next(new Error("At least one image is required", { cause: 400 }));
  const images = req.files.images;
  const cloudFolder = nanoid();
  let Images = [];
  for (const image of images) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      image.path,
      {
        folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/products/${cloudFolder}`,
      },
    );
    Images.push({
      id: public_id,
      url: secure_url,
    });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    {
      folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/products/${cloudFolder}`,
    },
  );

  const newProduct = await Product.create({
    ...req.body,
    defaultImage: {
      id: public_id,
      url: secure_url,
    },
    images: Images,
    createdBy: req.user._id,
    cloudFolder,
  });
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: newProduct,
  });
};

export const getAllProducts = async (req, res, next) => {
  const { sort, page, keyword } = req.query;
  const products = await Product.find({ ...req.query })
    .sort(sort)
    .search(keyword)
    .paginate(page)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("createdBy");

  return res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
  });
};

export const getProductById = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .populate("createdBy");

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  return res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;

  // Find product
  const isExistProduct = await Product.findById(productId);

  if (!isExistProduct) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  // Authorization
  if (
    req.user.role !== "admin" &&
    (req.user.role !== "seller" ||
      !req.user._id.equals(isExistProduct.createdBy))
  ) {
    return next(
      new Error("You are not authorized to update this product", {
        cause: 403,
      }),
    );
  }

  const { category, subcategory, brand } = req.body;

  // Validate category if provided
  if (category) {
    const isExistCategory = await Category.findById(category);

    if (!isExistCategory) {
      return next(new Error("Invalid category id", { cause: 400 }));
    }
  }

  // Validate subcategory if provided
  if (subcategory) {
    const isExistSubCategory = await Subcategory.findById(subcategory);

    if (!isExistSubCategory) {
      return next(new Error("Invalid sub-category id", { cause: 400 }));
    }
  }

  // Validate brand if provided
  if (brand) {
    const isExistBrand = await Brand.findById(brand);

    if (!isExistBrand) {
      return next(new Error("Invalid brand id", { cause: 400 }));
    }
  }

  // Update body fields
  Object.assign(isExistProduct, req.body);

  // Update default image
  if (req.files?.defaultImage?.length) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.defaultImage[0].path,
      {
        public_id: isExistProduct.defaultImage.id,
      },
    );

    isExistProduct.defaultImage = {
      id: public_id,
      url: secure_url,
    };
  }

  // Update product images
  if (req.files?.images?.length) {
    // Delete old images
    const oldImageIds = isExistProduct.images.map((image) => image.id);

    if (oldImageIds.length) {
      await cloudinary.api.delete_resources(oldImageIds);
    }

    // Upload new images
    const newImages = [];

    for (const image of req.files.images) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path,
        {
          folder: `${process.env.CLOUDINARY_CLOUD_FOLDER}/products/${isExistProduct.cloudFolder}`,
        },
      );

      newImages.push({
        id: public_id,
        url: secure_url,
      });
    }

    isExistProduct.images = newImages;
  }

  await isExistProduct.save();

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: isExistProduct,
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const isExistProduct = await Product.findById(productId);
  if (!isExistProduct)
    return next(new Error("Product not found", { cause: 404 }));
  if (
    req.user._id.equals(isExistProduct.createdBy) === false &&
    req.user.role !== "admin"
  ) {
    return next(
      new Error("You are not the owner of this product", { cause: 403 }),
    );
  }
  await isExistProduct.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
