import express from "express";
export const bookRouter = express.Router();
import { BookDataModel } from "../models/book-data.model.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { randomUUID } from "crypto";
import multer from "multer";
import jwt_decode from "jwt-decode";

// Get all books from db
bookRouter.get("/", async (req, res) => {
  try {
    const books = await BookDataModel.find({}, { __v: 0 }).lean();
    res.render("books", { books });
  } catch (err) {
    console.log(err.message);
  }
});

// Get all books from db
bookRouter.get("/data", async (req, res) => {
  try {
    const book = await BookDataModel.find({}, { __v: 0 }).lean();
    res.send(book);
  } catch (err) {
    console.log(err.message);
  }
});

bookRouter.get("/addBook", isAuthenticated, async (req, res, next) => {
  const token = req.cookies.token;
  const decoded = jwt_decode(token);
  if (decoded.role !== "user") {
    res.render("addBook");
  } else {
    return res.status(403).send("Forbidden Page !");
  }
})

/* Set Destination For Multer */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, randomUUID() + ".png");
  },
});

let upload = multer({ storage: storage });

/* Get Image From HTML */
bookRouter.post("/addBook", isAuthenticated, upload.single("image"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  const bookImage = file.filename;
  const { name, author, category, price, isbn } = req.body;

  const book = new BookDataModel({
    name,
    author,
    category,
    price,
    isbn,
    bookImage,
  });

  book
    .save()
    .then((doc) => {
      return res.send(doc);
    })
    .catch((err) => {
      console.log(err);
      res.send("Failed to add book !");
    });
});

/* Send Book Data To DB */
bookRouter.post("/", isAuthenticated, function (req, res) {
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
      return res.send(doc);
    })
    .catch((err) => {
      console.log(err);
      res.send("Failed to add book !");
    });
});

bookRouter.post("/removeBook", isAuthenticated, async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt_decode(token);
  if (decoded.role === "user") {
    res.status(403).send('Forbidden');
  } else {
    const bookId = req.body.bookId;
    await BookDataModel.deleteOne({ _id: bookId });
    res.status(200).send('success');
  }
})

bookRouter.get("/editBook", isAuthenticated, async (req, res) => {
  const bookId = req.query.bookId;
  const token = req.cookies.token;
  const decoded = jwt_decode(token);
  if (decoded.role === "user") {
    res.status(403).send('Forbidden');
  } else {
    const book = await BookDataModel.findOne({ _id: bookId }).lean();
    res.render("editBook", { book });
  }
})

bookRouter.post("/editBook", isAuthenticated, upload.single("image"), async (req, res, next) => {
  const token = req.cookies.token;
  const decoded = jwt_decode(token);
  if (decoded.role === "user") {
    return res.status(403).send("Forbidden Page !");
  }
  const file = req.file;
  console.log(file.filename);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  const bookImage = file.filename;
  const { name, author, category, price, isbn } = req.body;

  const { bookId } = req.query;
  console.log(bookId);
  await BookDataModel.updateOne({ _id: bookId }, {
    name, author, category, price, isbn, bookImage
  })
  res.status(200).send('Success');
})