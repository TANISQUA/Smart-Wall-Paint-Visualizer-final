const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= AUTHENTICATE USER =================

const protect = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found."
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
};


// ================= ADMIN ONLY =================

const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required."
    });
  }

  next();
};


module.exports = {
  protect,
  adminOnly
};