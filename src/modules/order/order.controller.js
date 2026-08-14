import mongoose from "mongoose";
import { Cart } from "../../DB/models/cart.model.js";
import { Coupon } from "../../DB/models/coupon.model.js";
import { Order } from "../../DB/models/order.model.js";
import { Product } from "../../DB/models/product.model.js";

const getCouponForOrder = async (couponCode, subtotal, session) => {
  if (!couponCode) {
    return { couponSnapshot: null, finalPrice: subtotal };
  }

  const normalizedCode = couponCode.trim();
  const coupon = await Coupon.findOne({
    name: { $regex: `^${normalizedCode}$`, $options: "i" },
  }).session(session);

  if (!coupon) {
    throw new Error("Coupon not found", { cause: 404 });
  }

  if (coupon.expiredAt && new Date(coupon.expiredAt) < new Date()) {
    throw new Error("Coupon expired", { cause: 400 });
  }

  const discountPercentage = Number(coupon.discount ?? 0);
  const discountAmount = subtotal * (discountPercentage / 100);
  const finalPrice = Math.max(0, subtotal - discountAmount);

  return {
    couponSnapshot: {
      id: coupon._id,
      name: coupon.name,
      discount: discountPercentage,
      discountAmount,
    },
    finalPrice,
  };
};

export const createOrder = async (req, res, next) => {
  const { address, phone, payment, couponCode } = req.body;
  const userId = req.user._id;
  const session = await mongoose.startSession();

  let order;

  try {
    await session.withTransaction(async () => {
      // 1. Get the authenticated user's cart. The order must be created from the
      // existing cart instead of trusting a client-side product list.
      const cart = await Cart.findOne({ userId }).populate("products.productId").session(session);

      if (!cart) {
        throw new Error("Cart not found", { cause: 404 });
      }

      if (!cart.products || cart.products.length === 0) {
        throw new Error("Cart is empty", { cause: 400 });
      }

      // 2. Validate every product in the cart and check stock before creating an order.
      let subtotal = 0;
      const productSnapshots = [];
      const stockUpdates = [];

      for (const cartItem of cart.products) {
        if (!cartItem.productId) {
          throw new Error("Product not found in cart", { cause: 404 });
        }

        if (!Number.isInteger(cartItem.quantity) || cartItem.quantity < 1) {
          throw new Error("Invalid quantity in cart", { cause: 400 });
        }

        const product = await Product.findById(cartItem.productId).session(session);

        if (!product) {
          throw new Error("Product not found", { cause: 404 });
        }

        if (!product.inStock(cartItem.quantity)) {
          throw new Error("Requested quantity exceeds available stock", { cause: 400 });
        }

        // We store the product name and price at the time of checkout to preserve the
        // historical order information even if the product record changes later.
        const itemPrice = product.price;
        const totalPrice = itemPrice * cartItem.quantity;

        subtotal += totalPrice;

        productSnapshots.push({
          productId: product._id,
          name: product.name,
          quantity: cartItem.quantity,
          itemPrice,
          totalPrice,
        });

        stockUpdates.push({
          product,
          quantity: cartItem.quantity,
        });
      }

      // 3. Validate coupon if provided and calculate final price from database values.
      let couponSnapshot = null;
      let finalPrice = subtotal;

      if (couponCode) {
        const couponResult = await getCouponForOrder(couponCode, subtotal, session);
        couponSnapshot = couponResult.couponSnapshot;
        finalPrice = couponResult.finalPrice;
      }

      // 4. Create the order only after all validations pass.
      order = await Order.create(
        [
          {
            user: userId,
            products: productSnapshots,
            address,
            phone,
            payment: payment || "cash",
            subtotal,
            coupon: couponSnapshot,
            finalPrice,
            status: "placed",
          },
        ],
        { session },
      );

      // 5. Update product stock immediately after the order is created within the same
      // transaction so the order and stock changes stay consistent.
      for (const item of stockUpdates) {
        item.product.quantity -= item.quantity;
        item.product.soledItems = (item.product.soledItems || 0) + item.quantity;
        await item.product.save({ session });
      }

      // 6. Clear the cart after checkout to avoid duplicate orders from the same cart.
      cart.products = [];
      await cart.save({ session });

      order = order[0];
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    return next(error);
  } finally {
    session.endSession();
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "username email")
      .populate("coupon.id");

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("coupon.id");

    if (!order) {
      return next(new Error("Order not found", { cause: 404 }));
    }

    if (req.user.role !== "admin" && !req.user._id.equals(order.user)) {
      return next(new Error("Unauthorized to access this order", { cause: 403 }));
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "username email");

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new Error("Order not found", { cause: 404 }));
    }

    const validTransitions = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: ["refunded"],
      cancelled: [],
      refunded: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return next(new Error("Invalid status transition", { cause: 400 }));
    }

    if (status === "cancelled") {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new Error("Order not found", { cause: 404 }));
    }

    if (req.user.role !== "admin" && !req.user._id.equals(order.user)) {
      return next(new Error("Unauthorized to change this order", { cause: 403 }));
    }

    const allowedStatuses = ["placed", "confirmed"];
    if (!allowedStatuses.includes(order.status)) {
      return next(
        new Error("This order can no longer be cancelled in its current status", {
          cause: 400,
        }),
      );
    }

    // A cancelled order should restore the stock that was reduced during the initial purchase.
    for (const item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};
