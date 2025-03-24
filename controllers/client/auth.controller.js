const User = require("../../models/user.model");
const { hashPassword, comparePassword } = require("../../helpers/hashPassword");
const { generateToken } = require("../../helpers/jwt");
const Otp = require("../../models/otp.model");
const { sendMail } = require("../../helpers/sendMail");
const { generateRandomNumber } = require("../../helpers/generate");
// [POST] /api/auth/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email không tồn tại" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu không đúng" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// [POST] /api/auth/register
module.exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(402).json({ message: "Email đã tồn tại" });
    const ExistOTP = await Otp.findOne({ email: email });
    if (ExistOTP) {
      await Otp.deleteOne({ email: email });
    }
    const otpObj = {
      email: email,
      otp: generateRandomNumber(6),
      expireAt: Date.now(),
    };
    const otp = new Otp(otpObj);
    await otp.save();
    const subject = "Mã OTP xác nhận đăng kí";
    const html = `Mã OTP của bạn là:<b> ${otp.otp}</b>.Thời gian hiệu lực 3 phút`;
    sendMail(email, subject, html);
    res.json({ message: "Vui lòng kiểm tra email của bạn" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// [POST] /api/auth/register/otp
module.exports.registerOtp = async (req, res) => {
  try {
    const { firstName, lastName, email, otp } = req.body;
    req.body.fullname = firstName + " " + lastName;
    const otpObj = await Otp.findOne({
      email: email,
      otp: otp,
    });
    if (!otpObj) return res.status(401).json({ message: "OTP không đúng" });
    await Otp.deleteOne({ email: email, otp: otp });

    const user = new User(req.body);

    user.password = await hashPassword(user.password);
    user.role_id = "R3";
    await user.save();

    const token = generateToken(user);
    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// [GET] /api/auth/me
module.exports.me = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
