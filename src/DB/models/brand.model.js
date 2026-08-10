import { model, Schema, Types } from "mongoose";

const brandSchema = new Schema(
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
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export const Brand = model("Brand", brandSchema);
