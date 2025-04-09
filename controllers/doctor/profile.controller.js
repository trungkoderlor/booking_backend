const User = require("../../models/user.model");
const systemconfig = require("../../config/system");
const Doctor = require("../../models/doctor.model");
const Specialty = require("../../models/specialty.model");
const Clinic = require("../../models/clinic.model");

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
  try {
    const newDoctor = {
      ...req.user.toObject(),
      doctor: req.doctor.toObject(),
    };

    // Fetch all active specialties
    const specialties = await Specialty.find({ status: "active" }).select(
      "_id name"
    );

    // Fetch all active clinics
    const clinics = await Clinic.find({ status: "active" }).select("_id name");

    res.render("doctor/pages/profile/edit", {
      pageTitle: "Chỉnh sửa thông tin cá nhân",
      user: newDoctor,
      specialties: specialties,
      clinics: clinics,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin!");
    res.redirect("back");
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Handle file upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    // Filter user updates to only include fields in the user model
    const userUpdates = {
      fullname: updates.name,
      phone: updates.phone,
    };

    if (updates.avatar) {
      userUpdates.avatar = updates.avatar;
    }

    // Update user information
    await User.findByIdAndUpdate(req.user._id, userUpdates);

    // Prepare doctor updates
    const doctorUpdates = {
      description: updates.description,
    };

    // Handle multiple specialties (convert to array if single value)
    if (updates.specialties) {
      doctorUpdates.specialties = Array.isArray(updates.specialties)
        ? updates.specialties
        : [updates.specialties];
    }

    // Handle clinic
    if (updates.clinics) {
      doctorUpdates.clinics = updates.clinics;
    }

    // Update doctor information including clinics reference
    await Doctor.findOneAndUpdate({ userId: req.user._id }, doctorUpdates);

    req.flash("success", "Cập nhật thông tin thành công!");
    res.redirect(`${systemconfig.prefixDoctor}/profile`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật thông tin!");
    res.redirect("back");
  }
};
