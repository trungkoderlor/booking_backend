const mongoose = require("mongoose");

const AllCodesSchema = new mongoose.Schema({
  key: String,
  type: String,
  valueEn: String,
  valueVi: String,
});
const AllCode = mongoose.model("AllCodes", AllCodesSchema, "allcodes");
module.exports = AllCode;
