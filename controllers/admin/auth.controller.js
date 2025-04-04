// [GET] /admin/auth/login
const User = require("../../models/user.model");
const { comparePassword } = require("../../helpers/hashPassword");
const systemconfig = require("../../config/system");
const { generateToken, verifyToken } = require("../../helpers/jwt");
module.exports.login = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (user && user.role_id === "R2") {
      res.redirect(`${systemconfig.prefixDoctor}/dashboard`);
      return;
    }
  }
  res.render("admin/pages/auth/login", {
    pageTitle: "Trang đăng nhập",
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash("error", `Tài khoản không tồn tại !`);
    res.redirect("back");
    return;
  }
  if (user.role_id != "R1") {
    req.flash("error", `Tài khoản không có quyền truy cập !`);
    res.redirect("back");
    return;
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    req.flash("error", `Mật khẩu không đúng !`);
    res.redirect("back");
    return;
  }
  const token = generateToken(user, "15m");
  const refreshToken = generateToken(user, "7d");
  res.cookie("access_token", token, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    sameSite: "Strict",
  });
  res.redirect(`${systemconfig.prefixAdmin}/dashboard`);
};
// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refresh_token");
  res.redirect(`${systemconfig.prefixAdmin}/auth/login`);
};
