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
  res.render("doctor/pages/auth/login", {
    pageTitle: "Đăng nhập bác sĩ",
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
    role_id: "R2",
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Tài khoản không tồn tại hoặc không phải bác sĩ!");
    return res.redirect("back");
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    req.flash("error", "Mật khẩu không đúng!");
    return res.redirect("back");
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
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "Strict",
  });
  res.redirect(`${systemconfig.prefixDoctor}/dashboard`);
};

module.exports.logout = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect(`${systemconfig.prefixDoctor}/auth/login`);
};
