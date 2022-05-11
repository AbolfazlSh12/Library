import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import ejs from "ejs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { indexRouter } from "./routes/index.js";
import { userRouter } from "./routes/users.js";
import { authRouter } from "./routes/auth.js";
import { bookRouter } from "./routes/books.js";
// import { notFoundRouter } from "./routes/notFound.js";
import { connectDatabase } from "./db.js";
// import { addBookRouter } from "./routes/addBook.js";
import { mediaRouter } from "./routes/media.js";

connectDatabase();

export const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/books", bookRouter);
// app.use("/addBook", addBookRouter);
app.use("/uploads", mediaRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status("404").send("404 Not Found !");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
