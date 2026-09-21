const PaintColour = require("../models/PaintColour");

// Get all colours
const getColours = async (req, res) => {
  try {
    const colours = await PaintColour.find().sort({ createdAt: 1 });

    res.status(200).json(colours);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch colours",
      error: error.message
    });
  }
};


// Add colour
const addColour = async (req, res) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Colour name and colour code are required"
      });
    }

    const colour = await PaintColour.create({
      name,
      code
    });

    res.status(201).json({
      message: "Colour added successfully",
      colour
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add colour",
      error: error.message
    });
  }
};


// Update colour
const updateColour = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const colour = await PaintColour.findByIdAndUpdate(
      id,
      { name, code },
      { new: true, runValidators: true }
    );

    if (!colour) {
      return res.status(404).json({
        message: "Colour not found"
      });
    }

    res.status(200).json({
      message: "Colour updated successfully",
      colour
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update colour",
      error: error.message
    });
  }
};


// Delete colour
const deleteColour = async (req, res) => {
  try {
    const { id } = req.params;

    const colour = await PaintColour.findByIdAndDelete(id);

    if (!colour) {
      return res.status(404).json({
        message: "Colour not found"
      });
    }

    res.status(200).json({
      message: "Colour deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete colour",
      error: error.message
    });
  }
};


module.exports = {
  getColours,
  addColour,
  updateColour,
  deleteColour
};