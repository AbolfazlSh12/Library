import express from "express";
export const authRouter = express.Router();

import { UserDataModel } from "../models/user-data.model.js";

authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

authRouter.get("/signup", function (req, res, next) {
  res.render("signup");
});

authRouter.post("/login", function (req, res, next) {
  const { username, password } = req.body;
  console.log({ username, password });

  UserDataModel.find().then(console.log);

  UserDataModel.findOne({ username, password })
    .then((user) => {
      console.log(user);
      if (!user) {
        res.status(404).send("not found");
      } else {
        // res.send("logged in");
        return res.redirect('/');
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    });
  // res.send(`Username ${username} Password ${password}`);
});

authRouter.post("/signup", function (req, res, next) {
  const { name, family, username, email, password } = req.body;
  const user = new UserDataModel({ name, family, username, email, password });
  user
    .save()
    .then(() => {
      // res.send("signup");
      return res.redirect('/');
    })
    .catch(() => {
      res.send("signup error");
    });
});
