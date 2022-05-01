import mongoose from "mongoose";

const bookDataSchema = new mongoose.Schema({
    name: String,
    author: String,
    category: String,
    price: Number,
    isbn: String,
    bookImage: String,
  });
  
  export const BookDataModel = mongoose.model("BookDataModel", bookDataSchema);