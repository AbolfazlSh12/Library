import express from "express";
export const authRouter = express.Router();
import rand from "random-key";
import nodemailer from "nodemailer";
import "dotenv/config";
import { UserDataModel } from "../models/user-data.model.js";
import { CartDataModel } from "../models/cart-data.model.js";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import { isAuthenticated } from "../middlewares/auth.js";
import cookieParser from "cookie-parser";
authRouter.use(cookieParser());

const sign = (user, role, res) => {
  jwt.sign(
    { username: user.username, role },
    process.env.JWT_SECRET,
    async (err, token) => {
      res.cookie("token", token);
      return res.send(token);
    }
  );
};

authRouter.get("/login", function (req, res, next) {
  res.render("login");
});

authRouter.get("/signup", function (req, res, next) {
  res.render("signup");
});

authRouter.get("/signup/verify", function (req, res, next) {
  // res.render("verify");
  // console.log(req.query.username);
  // console.log(req.query.token);
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

const sendVerificationEmail = (address, code, username) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSWORD,
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

authRouter.get("/changeRole", isAuthenticated, function (req, res) {
  const token = req.cookies.token;
  // console.log("Token is : ", token);
  const decoded = jwt_decode(token);
  // console.log("Decoded token is : ", decoded);
  if (decoded.role == "owner") {
    res.render("changeRole");
  } else {
    return res.status(403).send("Forbidden Page !");
  }
});

authRouter.get("/logout", function (req, res, next) {
  // console.log(req.cookies);
  req.cookies = null;
  // console.log(req.cookies);
  res.clearCookie("token");
  res.redirect("/");
  // res.end();
});

/* Email Verification */
authRouter.post("/signup", function (req, res, next) {
  const { email, username } = req.body;
  if (username == process.env.SUPERUSER_USERNAME) {
    res.status(409).send("Duplicate username !");
  } else {
    const random = rand.generate(6);

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
      .then((user) => {
        const role = user.role;
        sign(user, role, res);
        console.log("JWT Success !");
        sendVerificationEmail(email, random, username);
        return UserDataModel.findOne({ username: username })
      })
      .then((user) => {
        console.log(user);
        const userId = user._id.toString();
        console.log(userId);
        const userCart = new CartDataModel({ userId });

        return userCart
          .save()
      })
      .catch((err) => {
        console.log(err);
        res.status(409).send("Duplicate Request!");
      })
  }
});

authRouter.post("/login", function (req, res, next) {
  const { username, password } = req.body;

  const ownerName = process.env.SUPERUSER_USERNAME;
  const ownerPass = process.env.SUPERUSER_PASSWORD;
  if (username === ownerName) {
    console.log("Hello owner");
    if (password !== ownerPass) {
      return res.status(404).send("not found");
    } else {
      sign(username, "owner", res);
      // console.log(`Token is { ${req.cookies} }`);
    }
  }

  UserDataModel.findOne({ username, password })
    .then(async (user) => {
      const role = user.role;
      // console.log(role);
      if (!user) {
        res.status(404).send("not found");
      } else {
        sign(user, role, res);
        // console.log(`Token is { ${req.headers.cookie} }`);
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).send();
    });
});

/* Forget Password */
authRouter.post("/login/forgetPassword", function (req, res, next) {
  const email = req.body.email;
  // console.log(email);
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
  const { username, password } = req.body;

  UserDataModel.findOne({ username }).then(async (user) => {
    if (!user) {
      res.status(404).send("Not found !");
    } else {
      user.password = password;
      await user.save();
      res.redirect("/");
    }
  });
});

/* Set Role for users */
authRouter.post("/changeRole", isAuthenticated, function (req, res) {
  const index = req.headers.cookie.indexOf("token") + 6;
  const token = req.headers.cookie.slice(index);
  const decoded = jwt_decode(token);
  if (decoded.role === "owner") {
    const { username, role } = req.body;
    UserDataModel.findOne({ username })
      .then(async (user) => {
        if (!user) {
          res.status(404).send("not found");
        } else {
          console.log("Successfully changed role");
          user.role = role;
          await user.save();
          res.end();
          return;
        }
      })
      .catch((err) => {
        // console.log(err);
        res.status(500).send();
      });
  }
});
