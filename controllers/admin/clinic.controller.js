const Clinic = require("../../models/clinic.model");
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
