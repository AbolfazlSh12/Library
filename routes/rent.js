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
  const booksId = cartItem.books.map(book => book.bookId.toString());
  const books = await BookDataModel.find({ _id: { $in: booksId } }).lean();

  const rentBooks = [];
  for (const book of books) {
    const id = book._id.toString();
    const price = book.price;
    const rentBook = { id, price };
    rentBooks.push(rentBook);
  }
  console.log(rentBooks);

  const rent = await new RentDataModel({
    userId,
    books:rentBooks
  });
  console.log(rent);
  rent.save();
})