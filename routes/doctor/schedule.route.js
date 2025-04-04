const express = require("express");
const router = express.Router();
const scheduleController = require("../../controllers/doctor/schedule.controller");

router.get("/", scheduleController.viewSchedules);
router.get("/create", scheduleController.createSchedule);
router.post("/create", scheduleController.createSchedulePost);
router.delete("/:id/delete", scheduleController.deleteSchedule);

module.exports = router;
