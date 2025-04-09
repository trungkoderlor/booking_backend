const Clinic = require("../../models/clinic.model");
const Doctor = require("../../models/doctor.model");
const systemconfig = require("../../config/system");
//[GET] /admin/specialties
module.exports.index = async (req, res) => {
  let records = [];
  records = await Clinic.find({});
  res.render("admin/pages/clinics/index", {
    pageTitle: "Danh sách phòng Khám",
    fillterStatus: [{ name: "Hoạt Động" }, { name: "Ngừng Hoạt Động" }],
    records: records,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
module.exports.create = async (req, res) => {
  res.render("admin/pages/clinics/create", {
    pageTitle: "Thêm phòng Khám",
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
  const clinic = new Clinic(req.body);
  await clinic.save();
  res.redirect(`${systemconfig.prefixAdmin}/clinics`);
};

//[GET] /admin/clinics/edit/:slug
module.exports.edit = async (req, res) => {
  try {
    const slug = req.params.slug;
    const clinic = await Clinic.findOne({ slug: slug });

    if (!clinic) {
      req.flash("error", "Không tìm thấy phòng khám");
      return res.redirect(`${systemconfig.prefixAdmin}/clinics`);
    }

    res.render("admin/pages/clinics/edit", {
      pageTitle: "Chỉnh sửa phòng khám",
      record: clinic,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin phòng khám");
    res.redirect(`${systemconfig.prefixAdmin}/clinics`);
  }
};

//[PATCH] /admin/clinics/edit/:slug
module.exports.editPatch = async (req, res) => {
  try {
    const slug = req.params.slug;
    const updates = req.body;

    // Handle file upload
    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    const clinic = await Clinic.findOne({ slug: slug });
    if (!clinic) {
      req.flash("error", "Không tìm thấy phòng khám");
      return res.redirect(`${systemconfig.prefixAdmin}/clinics`);
    }

    await Clinic.findByIdAndUpdate(clinic._id, updates);

    req.flash("success", "Cập nhật phòng khám thành công");
    res.redirect(`${systemconfig.prefixAdmin}/clinics`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật phòng khám");
    res.redirect(`${systemconfig.prefixAdmin}/clinics/edit/${req.params.slug}`);
  }
};

//[GET] /admin/clinics/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const clinic = await Clinic.findOne({ slug: slug });

    if (!clinic) {
      req.flash("error", "Không tìm thấy phòng khám");
      return res.redirect(`${systemconfig.prefixAdmin}/clinics`);
    }

    // Find doctors working at this clinic
    const doctors = await Doctor.find({ clinics: clinic._id }).populate(
      "userId"
    );

    res.render("admin/pages/clinics/detail", {
      pageTitle: "Chi tiết phòng khám",
      record: clinic,
      doctors: doctors,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin phòng khám");
    res.redirect(`${systemconfig.prefixAdmin}/clinics`);
  }
};

//[DELETE] /admin/clinics/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const clinicId = req.params.id;
    await Clinic.findByIdAndUpdate(clinicId, { deleted: true });

    req.flash("success", "Xóa phòng khám thành công");
    res.redirect(`${systemconfig.prefixAdmin}/clinics`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa phòng khám");
    res.redirect(`${systemconfig.prefixAdmin}/clinics`);
  }
};
