const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema(
  {
    statusId: String,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    timeType: String,
  },
  {
    timestamps: true,
  }
);
const Booking = mongoose.model("Booking", BookingSchema, "bookings");
module.exports = Booking;
