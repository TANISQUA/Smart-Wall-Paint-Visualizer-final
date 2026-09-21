const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/authController");

const User = require("../models/User");

// ============================================================
// REGISTER
// ============================================================

router.post("/register", registerUser);

// ============================================================
// LOGIN
// ============================================================

router.post("/login", loginUser);

// ============================================================
// GET ALL USERS
// ============================================================

router.get("/users", getUsers);

// ============================================================
// GET TOTAL USER COUNT
// ============================================================

router.get("/users/count", async (req, res) => {
  try {

    const count = await User.countDocuments();

    console.log("Total Users Count:", count);

    res.status(200).json({
      count: count
    });

  } catch (error) {

    console.error(
      "Error getting user count:",
      error
    );

    res.status(500).json({
      message: "Failed to get user count",
      error: error.message
    });
  }
});

module.exports = router;