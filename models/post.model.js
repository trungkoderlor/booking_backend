const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const PostSchema = new mongoose.Schema(
  {
    content: String,
    poster: String,
    title: String,
    slug: { type: String, slug: "title", unique: true },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", PostSchema, "posts");
module.exports = Post;
