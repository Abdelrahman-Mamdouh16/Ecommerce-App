import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const connectionString = process.env.connectionString;

  if (!connectionString) {
    throw new Error("connectionString is not defined in environment variables");
  }

  try {
    await mongoose.connect(connectionString);
    console.log("Database is connected");
  } catch (error) {
    console.error("Error while connecting to DB", error);
    throw error;
  }
};