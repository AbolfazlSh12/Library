import express from "express";
export const bookRouter = express.Router();

/* GET book page. */
bookRouter.get("/", function (req, res, next) {
  res.render("books");
});