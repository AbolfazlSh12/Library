import express from "express";
export const bookRouter = express.Router();

/* GET home page. */
bookRouter.get("/", function (req, res, next) {
  res.render("books");
});
