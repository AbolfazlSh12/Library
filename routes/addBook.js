import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
export const addBookRouter = express.Router();
import { BookDataModel } from "../models/book-data.model.js";
import { randomUUID } from "crypto";
import multer from "multer";
import jwt_decode from "jwt-decode";


/* Set Destination For Multer */
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, randomUUID() + ".png");
    },
});

let upload = multer({ storage: storage });

/* GET Add Book page. */
addBookRouter.get("/",isAuthenticated,  function(req, res, next) {
    const token = req.cookies.token;
    // console.log("Token is : ", token);
    const decoded = jwt_decode(token);
    // console.log("Decoded token is : ", decoded);
    if (decoded.role == "admin") {
        res.render("addBook");
    } else {
        return res.status(403).send("Forbidden Page !");
    }
});

/* Get Image From HTML */
addBookRouter.post("/", upload.single("image"), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    const bookImage = file.filename;
    const { name, author, category, price, isbn } = req.body;
    console.log(req.body);

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
addBookRouter.post("/", isAuthenticated, function(req, res, next) {
    const { name, author, category, price, isbn } = req.body;
    console.log(req.body);

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