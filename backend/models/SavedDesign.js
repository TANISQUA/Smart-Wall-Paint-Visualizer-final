const mongoose = require("mongoose");

const savedDesignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    image: {
      type: String,
      required: true
    },

    color: {
      type: String,
      required: true
    },

    wallColor: {
      type: String,
      required: true
    },

    opacity: {
      type: Number,
      default: 50
    },

    date: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model(
    "SavedDesign",
    savedDesignSchema
  );