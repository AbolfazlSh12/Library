import mongoose from "mongoose";

export const connectDatabase = async () => {
  await mongoose.connect("mongodb://localhost:27017/test");
};
