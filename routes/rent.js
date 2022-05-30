import express from "express";
export const rentRouter = express.Router();
import { RentDataModel } from "../models/rent-data.model.js";
import { BookDataModel } from "../models/book-data.model.js";
import { CartDataModel } from "../models/cart-data.model.js";
import { isAuthenticated } from "../middlewares/auth.js";

/* Renting */
rentRouter.post('/', isAuthenticated, async (req, res) => {
  const userId = req.user._id.toString();
  const cartItem = await CartDataModel.findOne({ userId });
  if (cartItem.books.length == 0) {
    res.status(204).send('no content');
  } else {
    const booksId = cartItem.books.map(book => book.bookId.toString());
    const books = await BookDataModel.find({ _id: { $in: booksId } }).lean();

    const rentBooks = [];
    for (const book of books) {
      const id = book._id.toString();
      const price = book.price;
      const rentBook = { id, price };
      rentBooks.push(rentBook);
    }

    const memberId = req.user._id;
    const rent = await new RentDataModel({
      userId: memberId,
      books: rentBooks
    });
    await rent.save();
    await CartDataModel.updateOne({ userId: rent.userId }, { books: [] });
    res.status(200).send('Success');
  }
})