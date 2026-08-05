import { model, Schema, Types } from "mongoose";

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
  { timestamps: true  },
);

export const categoryModel = model("Category", categorySchema);
