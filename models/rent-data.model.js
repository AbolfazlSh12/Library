import mongoose from "mongoose";

const rentDataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    bookId: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

rentDataSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const RentDataModel = mongoose.model("RentDataModel", rentDataSchema);
