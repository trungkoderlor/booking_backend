// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang Tổng Quan",

    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
