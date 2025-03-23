const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/client/auth.controller");

router.post("/login", Controller.login);
module.exports = router;
