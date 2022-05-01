import express from "express";
export const mediaRouter = express.Router();

import { resolve } from "path";

/* GET home page. */
mediaRouter.get("/:path", function (req, res, next) {
  res.sendFile(resolve("uploads/" + req.params.path));
});
