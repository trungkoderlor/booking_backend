const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/clinic.controller");

router.get("/", Controller.index);
// router.get("/:slug", Controller.detail);
module.exports = router;
