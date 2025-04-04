module.exports.createPost = async (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email !`);
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", `vui lòng nhập mật khẩu !`);
    res.redirect("back");
  }
  next();
};
module.exports.loginPost = async (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email !`);
    res.redirect("back");
    return;
  }
  if (!req.body.password) {
    req.flash("error", `vui lòng nhập mật khẩu !`);
    res.redirect("back");
  }
  next();
};
