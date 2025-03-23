const User = require("../../models/user.model");

const { generateToken } = require("../../helpers/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email không tồn tại" });

    const isMatch = password === user.password;
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu không đúng" });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = { login };
