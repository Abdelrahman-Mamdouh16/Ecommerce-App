import { Cart } from "../../DB/models/cart.model.js";
import { Product } from "../../DB/models/product.model.js";

const populateCart = (cartId) =>
  Cart.findById(cartId).populate("products.productId");

export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // 1. Check if the product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  // 2. Check stock
  if (quantity > product.quantity) {
    return next(
      new Error("Requested quantity exceeds available stock", {
        cause: 400,
      }),
    );
  }

  // 3. Get user's cart
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const newCart = await Cart.create({
      userId,
      products: [{ productId, quantity }],
    });

    const populatedCart = await populateCart(newCart._id);

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: populatedCart,
    });
  }

  // 4. Check if product already exists in cart
  const cartProduct = cart.products.find((item) =>
    item.productId.equals(productId),
  );

  if (cartProduct) {
    // 5. Product already exists → increase quantity
    const newQuantity = cartProduct.quantity + quantity;

    if (newQuantity > product.quantity) {
      return next(
        new Error("Requested quantity exceeds available stock", {
          cause: 400,
        }),
      );
    }

    cartProduct.quantity = newQuantity;
  } else {
    // 6. Product doesn't exist → add it
    cart.products.push({
      productId,
      quantity,
    });
  }

  // 7. Save cart
  await cart.save();

  const populatedCart = await populateCart(cart._id);

  return res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: populatedCart,
  });
};

export const getUserCart = async (req, res, next) => {
  const userId = req.user._id;
  if (req.user.role === "user") {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return next(new Error("Cart not found", { cause: 404 }));
    }

    return res.status(200).json({
      success: true,
      message: "User cart retrieved successfully",
      data: cart,
    });
  }
  if (req.user.role === "admin" && !req.body.cartId) {
    return next(new Error("Cart ID is required!", { cause: 400 }));
  }
  const cart = await Cart.findById(req.body.cartId);
  return res.json({
    success: true,
    message: "User cart retrieved successfully",
    results: { cart },
  });
};

export const updateCart = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new Error("Product not found", { cause: 404 }));
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  const cartProduct = cart.products.find((item) =>
    item.productId.equals(productId),
  );

  if (!cartProduct) {
    return next(new Error("Product not found in cart", { cause: 404 }));
  }

  if (quantity > product.quantity) {
    return next(
      new Error("Requested quantity exceeds available stock", { cause: 400 }),
    );
  }

  cartProduct.quantity = quantity;
  await cart.save();

  const populatedCart = await populateCart(cart._id);

  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: populatedCart,
  });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  const productIndex = cart.products.findIndex((item) =>
    item.productId.equals(productId),
  );

  if (productIndex === -1) {
    return next(new Error("Product not found in cart", { cause: 404 }));
  }

  cart.products.splice(productIndex, 1);

  if (cart.products.length === 0) {
    await cart.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
    });
  }

  await cart.save();

  const populatedCart = await populateCart(cart._id);

  return res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: populatedCart,
  });
};

export const clearCart = async (req, res, next) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new Error("Cart not found", { cause: 404 }));
  }

  await cart.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
};


