import jwt from "jsonwebtoken";
import "dotenv/config";
import { UserDataModel } from "../models/user-data.model.js";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    // console.log("Token is : ", token);
    return res.status(401).send("You'r not logged in !");
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    async (err, { username, role }) => {
      if (err) {
        return res.status(400).send("Unauthorized");
      }
      const user = await UserDataModel.findOne({ username }).lean();

      req.user = user;
      return next();
    }
  );
};
