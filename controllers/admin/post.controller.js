// [GET] /admin/posts
const Post = require("../../models/post.model");
const User = require("../../models/user.model");
const systemconfig = require("../../config/system");

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

//[GET] /admin/posts/create
module.exports.create = async (req, res) => {
  try {
    res.render("admin/pages/posts/create", {
      pageTitle: "Thêm bài viết mới",
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải trang tạo bài viết");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  }
};

//[POST] /admin/posts/create
module.exports.createPost = async (req, res) => {
  try {
    const postData = req.body;

    // Handle file upload
    if (req.file) {
      postData.poster = `/uploads/${req.file.filename}`;
    }

    // Set default author (admin user)
    postData.authorId = req.user._id;

    const post = new Post(postData);
    await post.save();

    req.flash("success", "Tạo bài viết thành công");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tạo bài viết");
    res.redirect(`${systemconfig.prefixAdmin}/posts/create`);
  }
};

//[GET] /admin/posts/edit/:slug
module.exports.edit = async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await Post.findOne({ slug: slug });

    if (!post) {
      req.flash("error", "Không tìm thấy bài viết");
      return res.redirect(`${systemconfig.prefixAdmin}/posts`);
    }

    res.render("admin/pages/posts/edit", {
      pageTitle: "Chỉnh sửa bài viết",
      record: post,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin bài viết");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  }
};

//[PATCH] /admin/posts/edit/:slug
module.exports.editPatch = async (req, res) => {
  try {
    const slug = req.params.slug;
    const updates = req.body;

    // Handle file upload
    if (req.file) {
      updates.poster = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findOne({ slug: slug });
    if (!post) {
      req.flash("error", "Không tìm thấy bài viết");
      return res.redirect(`${systemconfig.prefixAdmin}/posts`);
    }

    await Post.findByIdAndUpdate(post._id, updates);

    req.flash("success", "Cập nhật bài viết thành công");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật bài viết");
    res.redirect(`${systemconfig.prefixAdmin}/posts/edit/${req.params.slug}`);
  }
};

//[GET] /admin/posts/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await Post.findOne({ slug: slug });

    if (!post) {
      req.flash("error", "Không tìm thấy bài viết");
      return res.redirect(`${systemconfig.prefixAdmin}/posts`);
    }

    // Find author information
    const author = await User.findById(post.authorId);

    res.render("admin/pages/posts/detail", {
      pageTitle: "Chi tiết bài viết",
      record: post,
      author: author,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin bài viết");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  }
};

//[DELETE] /admin/posts/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndUpdate(postId, { deleted: true });

    req.flash("success", "Xóa bài viết thành công");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa bài viết");
    res.redirect(`${systemconfig.prefixAdmin}/posts`);
  }
};
