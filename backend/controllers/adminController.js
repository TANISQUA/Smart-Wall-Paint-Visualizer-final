const User = require("../models/User");
const PaintColour = require("../models/PaintColour");

// ===============================
// GET ALL USERS
// ===============================

const getUsers = async (req, res) => {

  try {

    const users = await User
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch users"
    });
  }
};


// ===============================
// GET USER COUNT
// ===============================

const getUserCount = async (req, res) => {

  try {

    const count = await User.countDocuments();

    res.json({
      success: true,
      count
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to get user count"
    });
  }
};


// ===============================
// DELETE USER
// ===============================

const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {

      return res.status(400).json({
        message: "You cannot delete your own admin account."
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to delete user"
    });
  }
};


// ===============================
// GET ADMIN STATISTICS
// ===============================

const getStatistics = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments();

    const totalColours = await PaintColour.countDocuments();

    res.status(200).json({
      success: true,
      totalUsers: totalUsers,
      totalColours: totalColours
    });

  } catch (error) {

    console.error("Statistics Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load statistics",
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserCount,
  deleteUser,
  getStatistics
};
