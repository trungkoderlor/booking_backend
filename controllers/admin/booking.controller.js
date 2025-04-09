const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");
const AllCode = require("../../models/allcode.model");
const systemconfig = require("../../config/system");
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

//[GET] /admin/bookings/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "doctorId",
        populate: { path: "userId" },
      })
      .populate("patientId")
      .populate("scheduleId");

    if (!booking) {
      req.flash("error", "Không tìm thấy lịch hẹn");
      return res.redirect(`${systemconfig.prefixAdmin}/bookings`);
    }

    // Get status options
    const statusOptions = await AllCode.find({ key: "status" });

    // Get time information
    const timeInfo = await AllCode.findOne({
      key: "time",
      type: booking.scheduleId.timeType,
    });

    const bookingDetails = {
      ...booking.toObject(),
      scheduleId: {
        ...booking.scheduleId.toObject(),
        time: timeInfo ? timeInfo.valueVi : "Không xác định",
      },
    };

    res.render("admin/pages/bookings/detail", {
      pageTitle: "Chi tiết lịch hẹn",
      booking: bookingDetails,
      statusOptions: statusOptions,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải thông tin lịch hẹn");
    res.redirect(`${systemconfig.prefixAdmin}/bookings`);
  }
};

//[PATCH] /admin/bookings/status/:id
module.exports.updateStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { statusId } = req.body;

    await Booking.findByIdAndUpdate(bookingId, { statusId: statusId });

    req.flash("success", "Cập nhật trạng thái lịch hẹn thành công");
    res.redirect(`${systemconfig.prefixAdmin}/bookings/detail/${bookingId}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật trạng thái lịch hẹn");
    res.redirect(
      `${systemconfig.prefixAdmin}/bookings/detail/${req.params.id}`
    );
  }
};

//[DELETE] /admin/bookings/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const bookingId = req.params.id;
    await Booking.findByIdAndUpdate(bookingId, { deleted: true });

    req.flash("success", "Xóa lịch hẹn thành công");
    res.redirect(`${systemconfig.prefixAdmin}/bookings`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa lịch hẹn");
    res.redirect(`${systemconfig.prefixAdmin}/bookings`);
  }
};
