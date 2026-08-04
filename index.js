import express from "express";
import cors from "cors";
import { connectDB } from "./src/DB/DBConnection.js";
import authRouter from "./src/modules/auth/auth.router.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

// DBConnection
await connectDB();
// Routes
app.use("/api/auth", authRouter);

// NotFound Routes
app.all("/{*splat}", (req, res, next) => {
  return next(new Error("Route not found", { cause: 404 }));
});

// error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(error.cause || 500).json({
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
