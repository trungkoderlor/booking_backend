const Doctor = require("../../models/doctor.model");
const User = require("../../models/user.model");
const systemconfig = require("../../config/system");

//[GET] /doctor/dashboard
module.exports.index = async (req, res) => {
  const newDoctor = {
    ...req.user.toObject(),
    doctor: req.doctor.toObject(),
  };
  res.render("doctor/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    user: newDoctor,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
