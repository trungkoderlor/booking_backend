const User = require("../../models/user.model");
const { hashPassword, comparePassword } = require("../../helpers/hashPassword");

//[PATCH] api/users/update
module.exports.update = async (req, res) => {
  try {
    if (req.user.email !== req.body.email) {
      const existEmail = await User.findOne({ email: req.body.email });
      if (existEmail) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }
    }
    if (req.file) {
      req.body.avatar = `/uploads/${req.file.filename}`;
    }
    await User.updateOne({ _id: req.user._id }, req.body);
    const user = await User.findOne({ _id: req.user._id }).select(
      "-password -deleted -role_id -createdAt -updatedAt"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
//[PATCH] api/users/change-password
module.exports.changePassword = async (req, res) => {
  try {
    if (!(await comparePassword(req.body.currentPassword, req.user.password))) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    await User.updateOne(
      { _id: req.user._id },
      { password: await hashPassword(req.body.newPassword) }
    );
    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
