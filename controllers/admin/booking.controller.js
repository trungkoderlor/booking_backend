const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");
const AllCode = require("../../models/allcode.model");
//[GET] /admin/bookings
module.exports.index = async (req, res) => {
  const records = await Booking.find({});
  const newrecords = await Promise.all(
    records.map(async (record) => ({
      ...record.toObject(),
      time:
        (await AllCode.findOne({ key: "time", type: record.timeType })) || {},
    }))
  );
  res.render("admin/pages/bookings/index", {
    pageTitle: "Bookings",
    records: newrecords,
    fillterStatus: [{ name: "Chờ Xác Nhận", class: "active" }],
    expressFlash: {
      success: req.flash("success"),
      error: req.flash("error"),
    },
  });
};
