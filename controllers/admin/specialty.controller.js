const Specialty = require("../../models/specialty.model");
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
