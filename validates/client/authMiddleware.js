const { verifyToken } = require("../../helpers/jwt");
const User = require("../../models/user.model");
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Bạn chưa đăng nhập" });

  try {
    decoded = verifyToken(token);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
