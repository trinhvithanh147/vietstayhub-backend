const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    check_in: {
      type: Date,
      required: true,
    },

    check_out: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    rooms_count: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    price_per_night: {
      type: Number,
      required: true,
    },

    total_price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["unpaid", "paid", "failed", "cancelled"],
      default: "unpaid",
    },

    payment_method: {
      type: String,
      enum: ["payos", "cash"],
      default: "payos",
    },

    order_code: {
      type: Number,
      unique: true,
      sparse: true,
    },

    checkout_url: {
      type: String,
      default: "",
    },

    paid_at: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "completed", "cancelled"],
      default: "pending_payment",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
