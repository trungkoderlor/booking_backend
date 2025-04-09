const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/admin/booking.controller");

router.get("/", Controller.index);
router.get("/detail/:id", Controller.detail);
router.patch("/status/:id", Controller.updateStatus);
router.delete("/delete/:id", Controller.delete);

module.exports = router;
