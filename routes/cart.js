import express from "express";
export const cartRouter = express.Router();
import { CartDataModel } from "../models/cart-data.model.js";
import { BookDataModel } from "../models/book-data.model.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Get all books from cartDataModel
cartRouter.get("/", isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const cartItem = await CartDataModel.findOne({ userId });
        const booksId = cartItem.books.map(book => book.bookId.toString());
        const books = await BookDataModel.find({ _id: { $in: booksId } }).lean();

        res.render("cart", { books });
    } catch (err) {
        console.log(err.message);
    }
});

/* Add Book to cart */
cartRouter.post("/", isAuthenticated, function (req, res) {
    const userId = req.user._id.toString();
    const { bookId } = req.body;
    // const booksCount = await RentDataModel.find({ userId: userId }).count();
    BookDataModel.findOne({ _id: bookId }).then((book) => {
        if (!book) {
            res.status(404).send("not found");
        } else if (book.isAvailable === false) {
            res.status(410).send("not available"); // 410 (Gone status code)
        } else {
            CartDataModel.findOneAndUpdate(
                { userId: userId },
                { $push: { books: [{ bookId }] } },
            ).then(() => {
                book.isAvailable = false;
                book.save();
                res.status(200).send("Success!");
            }).catch((err) => {
                console.log(err.message);
            })
        }
    });
});
