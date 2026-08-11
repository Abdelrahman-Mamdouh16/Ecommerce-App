import { model, Schema, Types } from "mongoose";
import cloudinary from "../../utils/fileUploads/cloud.js";

const productSchema = new Schema(
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100,
  ).toFixed(2);
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

export const Product = model("Product", productSchema);
