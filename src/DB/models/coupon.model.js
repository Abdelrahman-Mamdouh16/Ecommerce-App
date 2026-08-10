import { model, Schema, Types } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    discount: {
      type: Number,
      // required: true,
      min: 0,
      max: 100,
    },
    expiredAt: {
      type: Date,
      // required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Coupon = model("Coupon", couponSchema);
