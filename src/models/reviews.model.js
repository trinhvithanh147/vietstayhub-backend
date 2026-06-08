const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    rating: Number,
    comment: String,
    is_visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
