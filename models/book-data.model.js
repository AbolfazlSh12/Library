import mongoose from "mongoose";

const bookDataSchema = new mongoose.Schema({
    id: Number,
    name: String,
    author: String,
    category: String,
    price: Number,
    ISBN: String,
  });
  
  export const BookDataModel = mongoose.model("BookDataModel", bookDataSchema);