const mongoose = require("mongoose");
const MarkdownSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  specialtyId: { type: mongoose.Schema.Types.ObjectId, ref: "Specialty" },
  contentHTML: String,
  contentMarkdown: String,
});
const Markdown = mongoose.model("Markdown", MarkdownSchema, "markdowns");
module.exports = Markdown;
