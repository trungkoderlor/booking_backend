const User = require("../../models/user.model");
const { generateToken, verifyToken } = require("../../helpers/jwt");
const systemconfig = require("../../config/system");
const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
    res.redirect(`${systemconfig.prefixAdmin}/auth/login`);
    return;
  }

  try {
    decoded = verifyToken(accessToken);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    if (refreshToken) {
      try {
        const decodedRefresh = verifyToken(refreshToken);
        req.user = await User.findById(decodedRefresh.id);
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
        return res.redirect(`${systemconfig.prefixAdmin}/auth/login`);
      }
    }

    return res.redirect(`${systemconfig.prefixAdmin}/auth/login`);
  }
};

module.exports = authMiddleware;
