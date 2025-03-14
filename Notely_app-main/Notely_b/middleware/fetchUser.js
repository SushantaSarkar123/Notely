const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;//

const fetchUser = (req, res, next) => {
  try {
    const token = req.header("auth-token");
    console.log("Token received:", token);
    if (!token) {
      return res.status(401).send({ error: "Authenticate with valid token" });
    }

    const data = jwt.verify(token, SECRET_KEY);
    req.user = data.user;
    console.log("User ID:", req.user.id);
    next();
  } catch (error) {
    console.error("Error in fetchUser:", error.message);
    res.status(401).json({ error: "Invalid authentication token" });
  }
};

module.exports = fetchUser;
