import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          min: 1,
          required: true,
        },

        itemPrice: {
          type: Number,
          required: true,
          min: 0,
        },

        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    payment: {
      type: String,
      default: "cash",
      enum: ["cash", "visa"],
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    coupon: {
      id: {
        type: Types.ObjectId,
        ref: "Coupon",
      },

      name: {
        type: String,
      },

      discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      discountAmount: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    invoice: {
      url: String,
      id: String,
    },

    status: {
      type: String,
      default: "placed",
      enum: [
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
    },
  },
  {
    timestamps: true,
  },
);

// We store product snapshots and coupon snapshot values because prices and
// discounts can change later. The historical order should keep the exact values
// that were valid when the order was created, even if the product price or coupon
// is edited later.
orderSchema.index({ user: 1, createdAt: -1 });

export const Order = model("Order", orderSchema);
