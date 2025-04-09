const { verifyToken } = require("../../helpers/jwt");
const User = require("../../models/user.model");
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refresh_token;
  if (!token && !refreshToken) {
    return res.status(403).json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    if (refreshToken) {
      try {
        const decodedRefresh = verifyToken(refreshToken);
        req.user = await User.findById(decodedRefresh.id);
        const newAccessToken = generateToken(req.user, "15m");
        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: false,
          maxAge: 15 * 60 * 1000,
          sameSite: "Strict",
        });
        return next();
      } catch (refreshErr) {
        res.clearCookie("token");
        res.clearCookie("refresh_token");
        return res.status(403).json({ message: "Refresh token không hợp lệ" });
      }
    }
    res.clearCookie("token");
    res.clearCookie("refresh_token");
    return res.status(403).json({ message: "Đã hết phiên đăng nhập" });
  }
};

module.exports = authMiddleware;
