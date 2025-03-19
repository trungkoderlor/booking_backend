const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/booking.controller");

router.get("/", Controller.index);
module.exports = router;
