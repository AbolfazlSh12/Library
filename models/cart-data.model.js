import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserDataModel",
            unique: true,
        },
        books: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "BookDataModel"
                },
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ]
    },
    { timestamps: true }
);

export const CartDataModel = mongoose.model("CartDataModel", CartSchema);
