const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: String,
    expireAt: {
      type: Date,
      expires: 180,
    },
    otp: String,
  },
  {
    timestamps: true,
  }
);
const OtpSchema = mongoose.model("Otp", otpSchema, "otps");
module.exports = OtpSchema;
