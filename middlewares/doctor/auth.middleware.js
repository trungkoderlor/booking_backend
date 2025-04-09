const { verifyToken } = require("../../helpers/jwt");
const User = require("../../models/user.model");
const Doctor = require("../../models/doctor.model");
const { generateToken } = require("../../helpers/jwt");
const systemconfig = require("../../config/system");
const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    res.redirect(`${systemconfig.prefixDoctor}/auth/login`);
    return;
  }

  try {
    decoded = verifyToken(accessToken);
    req.user = await User.findById(decoded.id);
    req.doctor = await Doctor.findOne({ userId: req.user._id })
      .populate("clinics")
      .populate("specialties");

    next();
  } catch (err) {
    if (refreshToken) {
      try {
        const decodedRefresh = verifyToken(refreshToken);
        req.user = await User.findById(decodedRefresh.id);
        req.doctor = await Doctor.findOne({ userId: req.user._id })
          .populate("clinics")
          .populate("specialties");
        const newAccessToken = generateToken(req.user, "15m");
        res.cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 15 * 60 * 1000,
          sameSite: "Strict",
        });
        return next();
      } catch (refreshErr) {
        console.log("Refresh token invalid:", refreshErr);
        return res.redirect(`${systemconfig.prefixDoctor}/auth/login`);
      }
    }

    return res.redirect(`${systemconfig.prefixDoctor}/auth/login`);
  }
};

module.exports = authMiddleware;
