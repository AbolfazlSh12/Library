import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.headers?.Authorization || req.headers?.authorization;
  if (!token) {
    res.sendStatus(403).json({ error: "No credentials sent!" });
  }
  jwt.verify(token.replace("Bearer ", ""), "asdfsadfasdfasf", (err, user) => {
    if (err) {
      res.sendStatus(403).json({ error: "No credentials sent!" });
    }
    req.user = user;
    next();
  });
};
