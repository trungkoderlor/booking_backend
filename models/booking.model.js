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
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    info: {
      email: String,
      fullname: String,
      phone: String,
      address: String,
      birthyear: String,
      gender: String,
      reasons: String,
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
