import mongoose from "mongoose";

const bookDataSchema = new mongoose.Schema({
    name: String,
    author: String,
    category: String,
    price: Number,
    isbn: String,
    bookImage: String,
    isAvailable: {type: Boolean, default: true},
  });
  
  export const BookDataModel = mongoose.model("BookDataModel", bookDataSchema);