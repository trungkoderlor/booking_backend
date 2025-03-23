const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: String,
    address: String,
    gender: String,
    birthyear: Number,
    role_id: { type: String, enum: ["R1", "R2", "R3"], required: true },
    phone: String,
    avatar: String,
    slug: { type: String, slug: "fullname", unique: true },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema, "users");
module.exports = User;
