const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/specialty.controller");
const storageHelper = require("../../helpers/storageMulter");
const multer = require("multer");
const upload = multer({ storage: storageHelper() });

router.get("/", Controller.index);
router.get("/create", Controller.create);
router.post("/create", upload.single("avatar"), Controller.createPost);
router.get("/edit/:slug", Controller.edit);
router.patch("/edit/:slug", upload.single("avatar"), Controller.editPatch);
router.get("/detail/:slug", Controller.detail);
router.delete("/delete/:id", Controller.delete);

module.exports = router;
