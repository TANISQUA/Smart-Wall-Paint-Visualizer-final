const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUserCount,
  deleteUser,
  getStatistics
} = require("../controllers/adminController");

const {
  protect,
  adminOnly
} = require("../middleware/adminMiddleware");


// ===============================
// ADMIN STATISTICS
// ===============================

router.get(
  "/statistics",
  protect,
  adminOnly,
  getStatistics
);


// ===============================
// GET ALL USERS
// ===============================

router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);


// ===============================
// USER COUNT
// ===============================

router.get(
  "/users/count",
  protect,
  adminOnly,
  getUserCount
);


// ===============================
// DELETE USER
// ===============================

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);


module.exports = router;