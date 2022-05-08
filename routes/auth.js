import express from "express";
export const authRouter = express.Router();
import rand from "random-key";
import nodemailer from "nodemailer";
import "dotenv/config";
import { UserDataModel } from "../models/user-data.model.js";
import jwt from "jsonwebtoken";

authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

authRouter.get("/signup", function (req, res, next) {
  res.render("signup");
});

authRouter.get("/signup/verify", function (req, res, next) {
  // res.render("verify");
  console.log(req.query.username);
  console.log(req.query.token);
  const username = req.query.username;
  const verifyEmailToken = req.query.token;
  UserDataModel.findOne({ username, verifyEmailToken }).then(async (user) => {
    if (!user) {
      res.status(409).send("Incorrect Input");
    } else {
      user.isVerified = true;
      await user.save();
      res.redirect("/");
    }
  });
});

authRouter.get("/login/forgetPassword", function (req, res, next) {
  res.render("forgetPass");
});

authRouter.get("/login/resetPassword", function (req, res, next) {
  console.log("It's a reset password page");
  res.render("resetPass");
});

authRouter.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  UserDataModel.findOne({ username, password })
    .then(async (user) => {
      if (!user) {
        res.status(404).send("not found");
      } else {
        jwt.sign({ username }, process.env.JWT_SECRET, async (err, token) => {
          console.log(process.env.JWT_SECRET);
          await user.save();
          return res.send(token);
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send();
    });
});

const sendVerificationEmail = (address, code, username) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    auth: {
      user: "simple.learner.110@gmail.com",
      pass: "LiveTheMomentNow",
    },
  });

  var mailOptions = {
    from: "simple.learner.110@gmail.com",
    to: address,
    subject: "Email verification From Library !",
    text: `http://localhost:3000/auth/signup/verify?username=${username}&token=${code}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("sent");
    }
  });
};

/* Email Verification */
authRouter.post("/signup", function (req, res, next) {
  const { email, username } = req.body;
  const random = rand.generate(6);
  sendVerificationEmail(email, random, username);

  const { name, family, password } = req.body;
  const user = new UserDataModel({
    name,
    family,
    username,
    email,
    password,
    verifyEmailToken: random,
  });
  user
    .save()
    .then(async (user) => {
      jwt.sign({ username }, process.env.JWT_SECRET, async (err, token) => {
        await user.save();
        return res.send(token);
      });
    })
    .catch(() => {
      res.status(409);
      res.send("Signup error !");
    });
});

/* Forget Password */
authRouter.post("/login/forgetPassword", function (req, res, next) {
  console.log("It's fine to forget your password");
  const email = req.body.email;
  console.log(email);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    auth: {
      user: "simple.learner.110@gmail.com",
      pass: "LiveTheMomentNow",
    },
  });

  var mailOptions = {
    from: "simple.learner.110@gmail.com",
    to: email,
    subject: "Rest Password Email !",
    text: "http://localhost:3000/auth/login/resetPassword",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send("sent");
    }
  });
});

/* Reset Password */
authRouter.post("/login/resetPassword", function (req, res) {
  const {username , password} = req.body;

  UserDataModel.findOne({ username }).then(async (user) => {
    if(!user) {
      res.status(404).send("Not found !");
    } else {
      user.password = password;
      await user.save();
      res.redirect('/');
    }
  })
})


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsaVJvc3RhbWkiLCJpYXQiOjE2NTIwMDMzOTV9.rnanI1inaNPLdBXkNFs40xLM5YU5lVILsw3y91JW7aQ