const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/doctor.controller");

router.get("/", Controller.index);
router.get("/:slug", Controller.detail);
router.get("/:slug/schedule/:schedule_id", Controller.schedule);
module.exports = router;
