const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/booking.controller");
const authMiddleware = require("../../validates/client/authMiddleware");
router.post("/create", authMiddleware, Controller.create);
router.get("/", authMiddleware, Controller.index);
router.get("/:id", authMiddleware, Controller.show);

module.exports = router;
