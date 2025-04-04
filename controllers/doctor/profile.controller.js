const User = require("../../models/user.model");
const systemconfig = require("../../config/system");
const Doctor = require("../../models/doctor.model");

module.exports.viewProfile = async (req, res) => {
  const newDoctor = {
    ...req.user.toObject(),
    doctor: req.doctor.toObject(),
  };

  res.render("doctor/pages/profile/view", {
    pageTitle: "Thông tin cá nhân",
    user: newDoctor,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

module.exports.editProfile = async (req, res) => {
  const newDoctor = {
    ...req.user.toObject(),
    doctor: req.doctor.toObject(),
  };

  res.render("doctor/pages/profile/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
    user: newDoctor,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

module.exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }
    await User.findByIdAndUpdate(req.user._id, updates);
    await Doctor.findOneAndUpdate({ userId: req.user._id }, updates);
    req.flash("success", "Cập nhật thông tin thành công!");
    res.redirect(`${systemconfig.prefixDoctor}/profile`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật thông tin!");
    res.redirect("back");
  }
};
