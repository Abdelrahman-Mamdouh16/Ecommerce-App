import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { connectDB } from "./src/DB/DBConnection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import userRouter from "./src/modules/user/user.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import productRouter from "./src/modules/product/product.router.js";
import cartRouter from "./src/modules/cart/cart.router.js";
import orderRouter from "./src/modules/order/order.router.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// DBConnection
await connectDB();

// Routes

// Auth Routes
app.use("/api/auth", authRouter);
// User Routes
app.use("/api/user", userRouter);
// Category Routes
app.use("/api/category", categoryRouter);
// Brand Routes
app.use("/api/brand", brandRouter);
// Coupon Routes
app.use("/api/coupon", couponRouter);
// product Routes
app.use("/api/product", productRouter);
// cart Routes
app.use("/api/cart", cartRouter);
// order Routes
app.use("/api/order", orderRouter);

// NotFound Routes
app.all("/{*splat}", (req, res, next) => {
  return next(new Error("Route not found", { cause: 404 }));
});

// error handler
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = typeof error?.cause === "number" ? error.cause : 500;

  return res.status(statusCode).json({
    status: false,
    message:
      error.message === "jwt expired"
        ? "Token expired, please login again"
        : error.message || "Internal server error",
    stack: error.stack,
  });
};

app.use(errorHandler);

// app listener
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
