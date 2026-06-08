const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    full_name: String,
    phone_number: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["", "male", "female", "other"],
      default: "",
    },
    home_address: {
      type: String,
      default: "",
    },
    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    reset_password: {
      code_hash: {
        type: String,
        default: "",
      },
      expires_at: {
        type: Date,
        default: null,
      },
      requested_at: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
