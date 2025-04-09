const AllCode = require("../../models/allcode.model");
const User = require("../../models/user.model");
const Clinic = require("../../models/clinic.model");
const Specialty = require("../../models/specialty.model");
const Doctor = require("../../models/doctor.model");
const { hashPassword, comparePassword } = require("../../helpers/hashPassword");
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
    req.body.password = await hashPassword(req.body.password);
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

//[GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "Không tìm thấy người dùng");
      return res.redirect(`${systemconfig.prefixAdmin}/users`);
    }

    let roleData = await AllCode.findOne({ type: user.role_id });

    res.render("admin/pages/users/detail", {
      pageTitle: "Chi tiết người dùng",
      user: user,
      role: roleData,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin người dùng");
    res.redirect(`${systemconfig.prefixAdmin}/users`);
  }
};

//[GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "Không tìm thấy người dùng");
      return res.redirect(`${systemconfig.prefixAdmin}/users`);
    }

    const roles = await AllCode.find({ key: "role" });
    const clinics = await Clinic.find({ status: "active" });
    const specialties = await Specialty.find({ status: "active" });

    let doctorData = null;
    if (user.role_id === "R2") {
      doctorData = await Doctor.findOne({ userId: user._id });
    }

    res.render("admin/pages/users/edit", {
      pageTitle: "Chỉnh sửa người dùng",
      user: user,
      doctor: doctorData,
      roles: roles,
      clinics: clinics,
      specialties: specialties,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin người dùng");
    res.redirect(`${systemconfig.prefixAdmin}/users`);
  }
};

//[PATCH] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Handle file upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "Không tìm thấy người dùng");
      return res.redirect(`${systemconfig.prefixAdmin}/users`);
    }

    // Update user
    await User.findByIdAndUpdate(userId, updates);

    // Handle doctor information if the user is a doctor
    if (updates.role_id === "R2") {
      const doctorData = {
        description: updates.description || "",
      };

      if (updates.specialty) {
        doctorData.specialties = Array.isArray(updates.specialty)
          ? updates.specialty
          : [updates.specialty];
      }

      if (updates.clinic) {
        doctorData.clinics = updates.clinic;
      }

      // Check if doctor record already exists
      const existingDoctor = await Doctor.findOne({ userId: userId });
      if (existingDoctor) {
        await Doctor.findByIdAndUpdate(existingDoctor._id, doctorData);
      } else {
        const doctor = new Doctor({
          userId: userId,
          ...doctorData,
        });
        await doctor.save();
      }
    }

    req.flash("success", "Cập nhật người dùng thành công");
    res.redirect(`${systemconfig.prefixAdmin}/users`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật người dùng");
    res.redirect(`${systemconfig.prefixAdmin}/users/edit/${req.params.id}`);
  }
};

//[DELETE] /admin/users/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndUpdate(userId, { deleted: true });

    // If user is a doctor, also mark doctor record as deleted
    const doctorRecord = await Doctor.findOne({ userId: userId });
    if (doctorRecord) {
      await Doctor.findByIdAndUpdate(doctorRecord._id, { deleted: true });
    }

    req.flash("success", "Xóa người dùng thành công");
    res.redirect(`${systemconfig.prefixAdmin}/users`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa người dùng");
    res.redirect(`${systemconfig.prefixAdmin}/users`);
  }
};
