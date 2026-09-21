const express = require("express");
const router = express.Router();

const SavedDesign = require("../models/SavedDesign");

// ============================================================
// GET ALL SAVED DESIGNS
// ============================================================

router.get("/", async (req, res) => {
  try {
    const designs = await SavedDesign.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(designs);

  } catch (error) {

    console.error("Error getting saved designs:", error);

    res.status(500).json({
      message: "Failed to get saved designs",
      error: error.message
    });
  }
});


// ============================================================
// GET SAVED DESIGNS COUNT
// ============================================================

router.get("/count", async (req, res) => {
  try {

    const count = await SavedDesign.countDocuments();

    console.log("Saved Designs Count:", count);

    res.status(200).json({
      count: count
    });

  } catch (error) {

    console.error("Error getting saved designs count:", error);

    res.status(500).json({
      message: "Failed to get saved designs count",
      error: error.message
    });
  }
});


// ============================================================
// SAVE NEW DESIGN
// ============================================================

router.post("/", async (req, res) => {

  try {

    const {
      userId,
      image,
      color,
      wallColor,
      opacity,
      date
    } = req.body;


    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }


    if (!image) {
      return res.status(400).json({
        message: "Image is required"
      });
    }


    if (!color) {
      return res.status(400).json({
        message: "Color is required"
      });
    }


    const newDesign = new SavedDesign({

      userId: userId,

      image: image,

      color: color,

      wallColor: wallColor || color,

      opacity: opacity ?? 50,

      date: date || new Date().toLocaleString()

    });


    const savedDesign = await newDesign.save();


    console.log("New design saved:", savedDesign._id);


    res.status(201).json({

      message: "Design saved successfully",

      design: savedDesign

    });


  } catch (error) {

    console.error("Error saving design:", error);

    res.status(500).json({

      message: "Failed to save design",

      error: error.message

    });

  }

});


// ============================================================
// DELETE DESIGN
// ============================================================

router.delete("/:id", async (req, res) => {

  try {

    const design = await SavedDesign.findById(req.params.id);


    if (!design) {

      return res.status(404).json({
        message: "Design not found"
      });

    }


    await SavedDesign.findByIdAndDelete(req.params.id);


    res.status(200).json({

      message: "Design deleted successfully"

    });


  } catch (error) {

    console.error("Error deleting design:", error);

    res.status(500).json({

      message: "Failed to delete design",

      error: error.message

    });

  }

});


module.exports = router;