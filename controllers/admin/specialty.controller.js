const Specialty = require("../../models/specialty.model");
const Doctor = require("../../models/doctor.model");
const systemconfig = require("../../config/system");
//[GET] /admin/specialties
module.exports.index = async (req, res) => {
  let records = [];
  records = await Specialty.find({});
  res.render("admin/pages/specialties/index", {
    pageTitle: "Danh sách chuyên khoa",
    fillterStatus: [{ name: "Hoạt Động" }, { name: "Ngừng Hoạt Động" }],
    records: records,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
module.exports.create = async (req, res) => {
  res.render("admin/pages/specialties/create", {
    pageTitle: "Thêm chuyên khoa",
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
//[POST] /admin/specialties/create
module.exports.createPost = async (req, res) => {
  if (req.file) {
    req.body.avatar = `/uploads/${req.file.filename}`;
  }
  const specialty = new Specialty(req.body);
  await specialty.save();
  res.redirect(`${systemconfig.prefixAdmin}/specialties`);
};
//[GET] /admin/specialties/edit/:slug
module.exports.edit = async (req, res) => {
  const slug = req.params.slug;
  const record = await Specialty.findOne({ slug: slug });
  res.render("admin/pages/specialties/edit", {
    pageTitle: "Chỉnh sửa chuyên khoa",
    record: record,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

//[PATCH] /admin/specialties/edit/:slug
module.exports.editPatch = async (req, res) => {
  try {
    const slug = req.params.slug;
    const updates = req.body;

    // Handle file upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    const specialty = await Specialty.findOne({ slug: slug });
    if (!specialty) {
      req.flash("error", "Không tìm thấy chuyên khoa");
      return res.redirect(`${systemconfig.prefixAdmin}/specialties`);
    }

    await Specialty.findByIdAndUpdate(specialty._id, updates);

    req.flash("success", "Cập nhật chuyên khoa thành công");
    res.redirect(`${systemconfig.prefixAdmin}/specialties`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật chuyên khoa");
    res.redirect(
      `${systemconfig.prefixAdmin}/specialties/edit/${req.params.slug}`
    );
  }
};

//[GET] /admin/specialties/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const specialty = await Specialty.findOne({ slug: slug });

    if (!specialty) {
      req.flash("error", "Không tìm thấy chuyên khoa");
      return res.redirect(`${systemconfig.prefixAdmin}/specialties`);
    }

    // Find doctors associated with this specialty
    const doctors = await Doctor.find({
      specialties: { $in: [specialty._id] },
    }).populate("userId");

    res.render("admin/pages/specialties/detail", {
      pageTitle: "Chi tiết chuyên khoa",
      record: specialty,
      doctors: doctors,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin chuyên khoa");
    res.redirect(`${systemconfig.prefixAdmin}/specialties`);
  }
};

//[DELETE] /admin/specialties/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const specialtyId = req.params.id;
    await Specialty.findByIdAndUpdate(specialtyId, { deleted: true });

    req.flash("success", "Xóa chuyên khoa thành công");
    res.redirect(`${systemconfig.prefixAdmin}/specialties`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa chuyên khoa");
    res.redirect(`${systemconfig.prefixAdmin}/specialties`);
  }
};
