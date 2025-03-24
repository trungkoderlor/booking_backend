const AllCode = require("../../models/allcode.model");
const User = require("../../models/user.model");
const Clinic = require("../../models/clinic.model");
const Specialty = require("../../models/specialty.model");
const Doctor = require("../../models/doctor.model");
const hashPassword = require("../../helpers/hashPassword");
const systemconfig = require("../../config/system");
//[GET] /admin/users
module.exports.index = async (req, res) => {
  const records = await User.find({});
  res.render("admin/pages/users/index", {
    pageTitle: "Danh sách người dùng",
    fillterStatus: [{ name: "Admin" }, { name: "Patient" }, { name: "Doctor" }],
    records: records,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
//[GET] /admin/users/create
module.exports.create = async (req, res) => {
  const roles = await AllCode.find({ key: "role" });
  const clinics = await Clinic.find({});
  const specialties = await Specialty.find({});
  res.render("admin/pages/users/create", {
    pageTitle: "Thêm người dùng",
    roles: roles,
    clinics: clinics,
    specialties: specialties,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
//[POST] /admin/users/create
module.exports.createPost = async (req, res) => {
  try {
    // Kiểm tra email đã tồn tại
    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail) {
      req.flash("error", "Email đã tồn tại");
      return res.redirect(`${systemconfig.prefixAdmin}/users/create`);
    }

    // Xử lý tệp tải lên
    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }

    // Tạo người dùng mới
    const user = new User(req.body);
    await user.save();
    if (req.body.role_id === "R2") {
      const doctor = new Doctor({
        userId: user._id,
        specialties: req.body.specialty,
        clinics: req.body.clinic,
        description: req.body.description,
      });
      await doctor.save();
    }
    req.flash("success", "Người dùng đã được tạo thành công");
    res.redirect(`${systemconfig.prefixAdmin}/users`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tạo người dùng");
    res.redirect(`${systemconfig.prefixAdmin}/users/create`);
  }
};
