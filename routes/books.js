import express from "express";
export const bookRouter = express.Router();
import { BookDataModel } from "../models/book-data.model.js";

// Get all books from db
bookRouter.get("/", async (req, res, next) => {
  try {
    const book = await BookDataModel.find({}, { __v: 0, _id: 0 });
    // console.log(book);
    res.render("books", { books: book });
  } catch (err) {
    console.log(err.message);
  }
});

// Get all books from db
bookRouter.get("/data", async (req, res, next) => {
  try {
    const book = await BookDataModel.find({}, { __v: 0, _id: 0 });
    res.send(book);
  } catch (err) {
    console.log(err.message);
  }
});
