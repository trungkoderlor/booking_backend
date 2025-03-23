const { verifyToken } = require("../../helpers/jwt");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Bạn chưa đăng nhập" });

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
