import jwt from "jsonwebtoken";
import "dotenv/config";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(403).send("Forbidden");
  }

  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.JWT_SECRET,
    (err, user) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }
      req.user = user;
      return next();
    }
  );
};
