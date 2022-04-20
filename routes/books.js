import express from "express";
export const bookRouter = express.Router();
// import { BookDataModel } from "../models/book-data.model.js";

/* GET book page. */
bookRouter.get("/", function (req, res, next) {
  res.render("books");
});

/* Fetch data from database. */
/* bookRouter.get("/", function (req, res, next) {
  BookDataModel.find({}).then((books) => {
    console.log(books);
    res.send(books);
  }).catch((err) => {
    res.status(500).send(err.message);
  })
}) */