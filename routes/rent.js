import express from "express";
export const rentRouter = express.Router();
import { RentDataModel } from "../models/rent-data.model.js";
import { BookDataModel } from "../models/book-data.model.js";
import { isAuthenticated } from "../middlewares/auth.js";

/* Renting */
rentRouter.post("/", isAuthenticated, async function (req, res) {
  const userId = req.user._id.toString();
  const rents = await RentDataModel.find({ userId: userId }).count();
  console.log(rents);
  const { bookId } = req.body;
  BookDataModel.findOne({ _id: bookId }).then(async (book) => {
    if (!book) {
      res.status(404).send("not found");
    } else if (book.isAvailable === false) {
      res.status(410).send("Not available"); // 410 (Gone status code)
    } else if (rents > process.env.RENTING_LIMIT-1) {
      console.log("it's too much");
      res.status(406).send("Not Acceptable");
    } else {
      const price = book.price;
      const rent = new RentDataModel({
        userId,
        bookId,
        price,
      });
      rent.save().then(() => {
        console.log(book.isAvailable);
        book.isAvailable = false;
        book.save();
        res.send("ok");
      })
        .catch((err) => {
          res.status(409).send("Duplicate rent!!");
        });
    }
  });
});
