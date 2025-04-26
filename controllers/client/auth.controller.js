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
    const refreshToken = generateToken(user, "7d");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });
    const token = generateToken(user, "15m");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
      sameSite: "Strict",
    });
    const refreshTokenM = generateToken(user, "365d");
    res.setHeader("x-access-token", token);
    res.setHeader("x-refresh-token", refreshTokenM);
    res.json({ user });
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
    const refreshToken = generateToken(user, "7d");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });
    const token = generateToken(user, "15m");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
      sameSite: "Strict",
    });
    const refreshTokenM = generateToken(user, "365d");
    res.setHeader("x-access-token", token);
    res.setHeader("x-refresh-token", refreshTokenM);
    res.json({
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
// [POST] /api/auth/forgot-password
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email không tồn tại" });
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
    const subject = "Mã OTP xác nhận đổi mật khẩu";
    const html = `Mã OTP của bạn là:<b> ${otp.otp}</b>.Thời gian hiệu lực 3 phút`;
    sendMail(email, subject, html);
    res.json({ message: "Vui lòng kiểm tra email của bạn" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// [POST] /api/auth/forgot-password/otp
module.exports.forgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpObj = await Otp.findOne({
      email: email,
      otp: otp,
    });
    if (!otpObj) return res.status(401).json({ message: "OTP không đúng" });
    res.json({ message: "Xác nhận thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// [PATCH] /api/auth/forgot-password/reset
module.exports.forgotPasswordReset = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const otpObj = await Otp.findOne({
      email: email,
      otp: otp,
    });
    if (!otpObj) return res.status(401).json({ message: "OTP không đúng" });
    if (!password)
      return res.status(401).json({ message: "Mật khẩu không được để trống" });
    if (!email)
      return res.status(401).json({ message: "Email không được để trống" });
    await Otp.deleteOne({ email: email, otp: otp });
    await User.updateOne(
      { email: email },
      { password: await hashPassword(password) }
    );
    const refreshToken = generateToken(user, "7d");
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      sameSite: "Strict",
    });
    const user = await User.findOne({ email });
    const token = generateToken(user, "15m");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000, // 15 phút
      sameSite: "Strict",
    });
    const refreshTokenM = generateToken(user, "365d");
    res.setHeader("x-access-token", token);
    res.setHeader("x-refresh-token", refreshTokenM);
    res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// [POST] /api/auth/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    res.clearCookie("token");
    res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
// [POST] /api/auth/mobile-login
module.exports.mobileLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email không được để trống" });
    }

    // Check if OTP already exists for this email and delete it
    const existOTP = await Otp.findOne({ email });
    if (existOTP) {
      await Otp.deleteOne({ email });
    }

    // Generate new OTP
    const otpObj = {
      email,
      otp: generateRandomNumber(6),
      expireAt: new Date(Date.now() + 3 * 60 * 1000), // 3 minutes expiry
    };

    const otp = new Otp(otpObj);
    await otp.save();

    // Send OTP via email
    const subject = "Mã OTP đăng nhập Mobile App";
    const html = `Mã OTP của bạn là:<b> ${otp.otp}</b>. Thời gian hiệu lực 3 phút`;
    await sendMail(email, subject, html);

    res.json({
      success: true,
      message: "Vui lòng kiểm tra email của bạn",
    });
  } catch (error) {
    console.error("Mobile login error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// [POST] /api/auth/mobile-verify-otp
module.exports.mobileVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email và OTP không được để trống" });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res
        .status(401)
        .json({ message: "OTP không đúng hoặc đã hết hạn" });
    }

    // Delete OTP after verification
    await Otp.deleteOne({ email, otp });

    // Check if user exists
    let user = await User.findOne({ email });

    // Create new user if it doesn't exist
    if (!user) {
      // Generate a random secure password
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await hashPassword(randomPassword);

      user = new User({
        email,
        password: hashedPassword,
        role_id: "R3", // Default role
        fullname: email.split("@")[0], // Default name from email
      });

      await user.save();
    }

    // Generate tokens
    const accessToken = generateToken(user, "15m");
    const refreshToken = generateToken(user, "365d");

    // Set tokens in response headers
    res.setHeader("x-access-token", accessToken);
    res.setHeader("x-refresh-token", refreshToken);

    // Return success with user data and tokens
    res.json({
      success: true,
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Mobile verify OTP error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
