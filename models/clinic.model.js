const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const ClinicSchema = new mongoose.Schema({
  address: String,
  description: String,
  avatar: String,
  name: String,
  slug: { type: String, slug: "name", unique: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});
const Clinic = mongoose.model("Clinic", ClinicSchema, "clinics");
module.exports = Clinic;
