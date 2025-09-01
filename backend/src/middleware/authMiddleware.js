const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware for authenticating non-admin users
const auth = function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader)
    return res.status(401).json({ message: "No token, authorization denied." });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Token format is invalid." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

// Middleware for authenticating Admins
const admin = function (req, res, next) {
  if (req.user.role !== "Admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Requires Admin role." });
  }
  next(); // If the user is an Admin, proceed
};

module.exports = { auth, admin };
