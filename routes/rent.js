import express from "express";
export const rentRouter = express.Router();
import { RentDataModel } from "../models/rent-data.model.js";
import { BookDataModel } from "../models/book-data.model.js";
import { isAuthenticated } from "../middlewares/auth.js";

/* Renting */
rentRouter.post("/", isAuthenticated, function (req, res) {
  const { bookId } = req.body;
  BookDataModel.findOne({ bookId }).then(async (book) => {
    if (!book) {
      res.status(404).send("not found");
    } else {
      const userId = req.user._id.toString();
      const price = book.price;
      const rent = new RentDataModel({
        userId,
        bookId,
        price,
      });
      rent
        .save()
        .then(() => {
          res.send("ok");
        })
        .catch((err) => {
          res.status(409).send("Duplicate rent!!");
        });
    }
  });
});
