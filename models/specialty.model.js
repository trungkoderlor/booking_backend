const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const SpecialtySchema = new mongoose.Schema({
  description: String,
  avatar: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  name: String,
  slug: { type: String, slug: "name", unique: true },
});
const Specialty = mongoose.model("Specialty", SpecialtySchema, "specialties");
module.exports = Specialty;
