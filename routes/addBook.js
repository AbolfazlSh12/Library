import express from "express";
export const addBookRouter = express.Router();

import { BookDataModel } from "../models/book-data.model.js";

/* GET Add Book page. */
addBookRouter.get("/", function (req, res, next) {
  res.render("addBook");
});

addBookRouter.post("/", function (req, res, next) {
  const { name, author, category, price, ISBN } = req.body;
  const book = new BookDataModel({
    name,
    author,
    category,
    price,
    ISBN,
  });
    book
    .save()
    .then((doc) => {
      console.log(doc);
      return res.redirect("/")
    })
    .catch(() => {
      res.send("Failed to add book !");
    });

});
