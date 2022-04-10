import express from "express";
export const notFoundRouter = express.Router();

/* GET 404 Not Found Page. */
notFoundRouter.get("/", function (req, res, next) {
  res.render("notFound");
});
