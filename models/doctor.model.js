const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Specialty" }],
  clinics: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  description: String,
});

const Doctor = mongoose.model("Doctor", DoctorSchema, "doctors");
module.exports = Doctor;
