import { model, Schema, Types } from "mongoose";

const cart = new Schema({
  products: [
    {
      productId: {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1, required: true },
    },
  ],
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,   
  },
});

export const Cart = model("Cart", cart);
