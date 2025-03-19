// [GET] /admin/posts
const Post = require("../../models/post.model");
module.exports.index = async (req, res) => {
  const records = await Post.find();
  res.render("admin/pages/posts/index", {
    pageTitle: "Posts",
    records: records,
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
