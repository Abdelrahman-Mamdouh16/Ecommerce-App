import cors from "cors";
import express from "express";
import { connectDB } from "./src/DB/DBConnection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import userRouter from "./src/modules/user/user.router.js";
// import multer from "multer";
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


// NotFound Routes
app.all("/{*splat}", (req, res, next) => {
  return next(new Error("Route not found", { cause: 404 }));
});

// error handler

app.use((error, req, res, next) => {
  return res.status(error.cause || 500).json({
    status: false,
    message:
      error.message === "jwt expired"
        ? "Token expired, please login again"
        : error.message || "Internal server error",
    stack: error.stack,
  });
});

// app listener
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
