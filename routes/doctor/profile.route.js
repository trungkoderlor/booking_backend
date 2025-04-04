const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/doctor/profile.controller");
router.get("/", profileController.viewProfile);

router.get("/edit", profileController.editProfile);
router.post("/edit", profileController.updateProfile);
module.exports = router;
