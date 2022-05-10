import mongoose from "mongoose";

const userDataSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  family: String,
  email: String, // email {type: String, unique: true}
  password: String,
  isVerified: { type: Boolean, default: false },
  verifyEmailToken: String,
  role: { 
    type: String, 
    enum: ["admin" , "user" , "owner"],
    default: "user" 
  },
});

userDataSchema.methods.getFullName = function getFullName() {
  return this.name + " " + this.family;
};

export const UserDataModel = mongoose.model("UserDataModel", userDataSchema);
