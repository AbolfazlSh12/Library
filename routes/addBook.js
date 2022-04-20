import express from "express";
export const addBookRouter = express.Router();
import jwt from "jsonwebtoken";
import { BookDataModel } from "../models/book-data.model.js";

/* GET Add Book page. */
addBookRouter.get("/", function (req, res, next) {
  res.render("addBook");
});

/* Check Token From Header */
addBookRouter.use(function (req, res, next) {
  jwt.verify(req.headers?.authorization, "asdfsadfasdfasf", (err, user) => {
    if (err) {
      res.sendStatus(403).json({ error: "No credentials sent!" });
    }
    req.user = user;
    next();
  });
});

/* Send Book Data To DB */
addBookRouter.post("/", function (req, res, next) {
  const { name, author, category, price, isbn } = req.body;
  const book = new BookDataModel({
    name,
    author,
    category,
    price,
    isbn,
  });
  book
    .save()
    .then((doc) => {
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Failed1 to add book !");
    });
});
