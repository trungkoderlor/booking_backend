const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: String,
  files: [String],
});
const History = mongoose.model("History", HistorySchema, "histories");
module.exports = History;
