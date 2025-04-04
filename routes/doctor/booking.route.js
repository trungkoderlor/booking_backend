const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/doctor/booking.controller");

// Booking routes (patient appointments)
router.get("/", bookingController.viewBookings);
router.get("/:id", bookingController.viewBookingDetail);
router.post(
  "/:id/status",

  bookingController.updateBookingStatus
);

module.exports = router;
