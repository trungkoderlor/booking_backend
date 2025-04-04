const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/doctor/dashboard.controller");

router.get("/", dashboardController.index);

module.exports = router;
