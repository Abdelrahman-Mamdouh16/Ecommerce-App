import mongoose, { model, Schema, Types } from "mongoose";
import cloudinary from "../../utils/fileUploads/cloud.js";

interface Product {
  name: string;
  description: string;
  images: {
    id: string;
    url: string;
  }[];
  defaultImage: {
    id: string;
    url: string;
  };
  price: number;
  discount: number;
  quantity: number;
  soledItems: number;
  category: Types.ObjectId;
  subcategory: Types.ObjectId;
  brand: Types.ObjectId;
  createdBy: Types.ObjectId;
  cloudFolder: string;
}

interface ProductMethods {
  inStock(quantity: number): boolean;
}

interface ProductQueryHelpers {
  paginate(
    page: number,
  ): mongoose.QueryWithHelpers<any, Product, ProductQueryHelpers>;

  search(
    keyword?: string,
  ): mongoose.QueryWithHelpers<any, Product, ProductQueryHelpers>;
}
const productSchema = new Schema<
  Product,
  mongoose.Model<Product, ProductQueryHelpers, ProductMethods>,
  ProductMethods,
  ProductQueryHelpers
>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 2,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 0,
    },
    quantity: { type: Number, required: true, default: 0 },
    soledItems: { type: Number, required: true, default: 0 },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    cloudFolder: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual("finalPrice").get(function () {
  return (this.price - (this.price * this.discount || 0) / 100).toFixed(2);
});

productSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const publicIds = [
      ...this.images.map((image) => image.id),
      this.defaultImage.id,
    ];
    await cloudinary.api.delete_resources(publicIds);
    await cloudinary.api.delete_folder(
      `${process.env.CLOUDINARY_CLOUD_FOLDER}/products/${this.cloudFolder}`,
    );
  },
);

productSchema.query.paginate = function (
  this: mongoose.QueryWithHelpers<any, Product, ProductQueryHelpers>,
  page: number,
) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 10;
  const skip = (page - 1) * limit;
  return this.skip(skip).limit(limit);
};

productSchema.query.search = function (
  this: mongoose.QueryWithHelpers<any, Product, ProductQueryHelpers>,
  keyword?: string,
) {
  if (!keyword || keyword === "undefined" || keyword === "null") return this;
  return this.find({
    name: { $regex: keyword, $options: "i" },
  });
};

productSchema.methods.inStock = function (quantity: number) {
  return this.quantity >= quantity ? true : false;
};

export const Product = model("Product", productSchema);
