import jwt from "jsonwebtoken";
import "dotenv/config";

export const isAuthenticated = (req, res, next) => {
    const token = req.cookies ?.token;
    if (!token) {
        console.log("Token is : " , token);
        return res.status(401).send("You'r not logged in !");
    }

    jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET,
        (err, user) => {
            if (err) {
                return res.status(400).send("Unauthorized");
            }
            req.user = user;
            return next();
        }
    );
};