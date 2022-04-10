import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  id: Number,
  name: String,
  family: String,
  username: String,
  email: String,
  password: String,
});

userDataSchema.methods.getFullName = function getFullName() {
  return this.name + " " + this.family;
};

export const UserDataModel = mongoose.model("UserDataModel", userDataSchema);
