import { model, Schema, Types } from "mongoose";
import cloudinary from "../../utils/fileUploads/cloud.js";

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
brandSchema.post(
  "deleteOne",
  { document: true, query: false },

  async function () {
    if (this.image) {
      await cloudinary.uploader.destroy(this.image.public_id);
    }
  },
);
export const Brand = model("Brand", brandSchema);
