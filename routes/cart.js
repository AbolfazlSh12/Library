import express from "express";
export const cartRouter = express.Router();
import { CartDataModel } from "../models/cart-data.model.js";
import { BookDataModel } from "../models/book-data.model.js";
import { isAuthenticated } from "../middlewares/auth.js";

/* Add Book to cart */
cartRouter.post("/", isAuthenticated, function (req, res) {
    const userId = req.user._id.toString();
    const { bookId } = req.body;
    // const booksCount = await RentDataModel.find({ userId: userId }).count();
    BookDataModel.findOne({ _id: bookId }).then((book) => {
        if (!book) {
            console.log("bookId");
            res.status(404).send("not found");
        } else if (book.isAvailable === false) {
            res.status(410).send("not available"); // 410 (Gone status code)
        } else {
            CartDataModel.findOneAndUpdate(
                { userId: userId },
                { $push: { books: [{ bookId }] } },
            ).then(() => {
                res.status(200).send("Success!");
            }).catch((err) => {
                console.log(err.message);
            })
        }
    });
});
