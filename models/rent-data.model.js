import mongoose from "mongoose";

const rentDataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    books: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "BookDataModel" },
        quantity: { type: Number, default: 1, },
        price: { type: Number, required: true },
      }
    ]
  },
  { timestamps: true }
);


export const RentDataModel = mongoose.model("RentDataModel", rentDataSchema);
