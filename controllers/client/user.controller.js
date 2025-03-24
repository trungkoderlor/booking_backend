const User = require("../../models/user.model");

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
