import { model, Schema, Types } from "mongoose";

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    isValid: {
      type: Boolean,
      default: true,
    },
    agent: {
      type: String,
    },
    expiredAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  },
  { timestamps: true },
);
tokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
export const Token = model("Token", tokenSchema);
