import { model, Schema, Types } from "mongoose";

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    slug: { type: String, required: true, unique: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true },
);

export const Subcategory = model("Subcategory", subcategorySchema);
