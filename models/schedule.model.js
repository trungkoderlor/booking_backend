const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },
    timeType: String,
    maxNumber: Number,
    currentNumber: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Schedule = mongoose.model("Schedule", ScheduleSchema, "Schedules");
module.exports = Schedule;
