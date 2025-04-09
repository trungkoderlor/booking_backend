const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/doctor/profile.controller");
const storageHelper = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storageHelper() });
router.get("/", profileController.viewProfile);

router.get("/edit", profileController.editProfile);
router.post("/edit", upload.single("avatar"), profileController.updateProfile);
module.exports = router;
