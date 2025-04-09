const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/user.controller");
const storageHelper = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storageHelper() });

router.get("/", Controller.index);
router.get("/create", Controller.create);
router.post("/create", upload.single("avatar"), Controller.createPost);
router.get("/detail/:id", Controller.detail);
router.get("/edit/:id", Controller.edit);
router.patch("/edit/:id", upload.single("avatar"), Controller.editPatch);
router.delete("/delete/:id", Controller.delete);

module.exports = router;
