import mongoose from "mongoose";

export const connectDB = async () => {
  return await mongoose
    .connect(process.env.connectionString)
    .then(() => {
      console.log("Database is connected");
    })
    .catch((err) => {
      console.error("Error while connecting to DB", err);
    });
};
