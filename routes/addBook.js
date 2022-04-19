import express from "express";
export const addBookRouter = express.Router();

import { BookDataModel } from "../models/book-data.model.js";
import { UserDataModel } from "../models/user-data.model.js";

/* GET Add Book page. */
addBookRouter.get("/", function (req, res, next) {
  res.render("addBook");
});

/* Send Book Data To DB */
addBookRouter.post("/", function (req, res, next) {
  const { key, username } = req.body;
  const user = UserDataModel.findOne({ username });
  if (user.authKey !== key) {
    return res.status(400).send("Invalid key");
  }

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
      // console.log(doc);
      return res.redirect("/");
    })
    .catch(() => {
      res.send("Failed to add book !");
    });
});
