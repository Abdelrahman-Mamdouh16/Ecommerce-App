import { model, Schema, Types } from "mongoose";
import { Subcategory } from "./subcategory.model.js";
import cloudinary from "../../utils/fileUploads/cloud.js";

const categorySchema = new Schema(
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
categorySchema.virtual("subcategories", {
  ref: "Subcategory",
  localField: "_id",
  foreignField: "categoryId",
});

categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await Subcategory.deleteMany({ categoryId: this._id });
    if (this.image) {
      await cloudinary.uploader.destroy(this.image.id);
    }
  },
);
export const Category = model("Category", categorySchema);
