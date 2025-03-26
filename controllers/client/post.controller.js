const Post = require("../../models/post.model");

// [GET] /api/posts
module.exports.index = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [GET] /api/posts/:slug
module.exports.detail = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
