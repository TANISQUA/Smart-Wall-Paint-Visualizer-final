const express = require("express");

const {
  getColours,
  addColour,
  updateColour,
  deleteColour
} = require("../controllers/colourController");

const router = express.Router();


// GET all colours
router.get("/", getColours);


// POST new colour
router.post("/", addColour);


// PUT update colour
router.put("/:id", updateColour);


// DELETE colour
router.delete("/:id", deleteColour);


module.exports = router;