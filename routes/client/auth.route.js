const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/auth.controller");
const authMiddleware = require("../../validates/client/authMiddleware");
router.post("/login", Controller.login);
router.post("/register", Controller.register);
router.get("/me", authMiddleware, Controller.me);
module.exports = router;
