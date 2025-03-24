const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/user.controller");
const authMiddleware = require("../../validates/client/authMiddleware");
const storageHelper = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storageHelper() });
router.patch(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  Controller.update
);
module.exports = router;
