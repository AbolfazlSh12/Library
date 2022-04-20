import express from "express";
export const authRouter = express.Router();

import { UserDataModel } from "../models/user-data.model.js";
import jwt from "jsonwebtoken";
import rand from "random-key";

authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

authRouter.get("/signup", function (req, res, next) {
  res.render("signup");
});

authRouter.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  UserDataModel.findOne({ username, password })
    .then(async (user) => {
      if (!user) {
        res.status(404).send("not found");
      } else {
        jwt.sign({ username }, "asdfsadfasdfasf", async (err, token) => {
          await user.save();
          return res.send(token);
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
});

authRouter.post("/signup", function (req, res, next) {
  const { name, family, username, email, password } = req.body;
  const user = new UserDataModel({
    name,
    family,
    username,
    email,
    password,
  });
  user
    .save()
    .then(async (user) => {
      const authKey = rand.generate(7);
      user.authKey = authKey;
      await user.save();
      return res.send(authKey);
    })
    .catch(() => {
      res.send("Signup error !");
    });
});
