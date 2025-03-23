const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "mysecret"; // Load từ .env

// Tạo token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role_id: user.role_id }, // Dữ liệu lưu trong token
    secretKey,
    { expiresIn: "7d" } // Token có hạn 7 ngày
  );
};

// Xác thực token
const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
