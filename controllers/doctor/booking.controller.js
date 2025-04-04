const Booking = require("../../models/booking.model");
const Schedule = require("../../models/schedule.model");
const AllCode = require("../../models/allcode.model");

module.exports.viewBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ doctorId: req.doctor._id })
      .populate("patientId")
      .populate("scheduleId")
      .sort({ createdAt: -1 });
    const allCodes = await AllCode.find();
    const allCodesMap = Object.fromEntries(
      allCodes.map((code) => [code.type, code.valueVi])
    );
    const result = bookings.map((booking) => ({
      ...booking.toObject(),
      time: allCodesMap[booking.scheduleId.timeType],
      status: allCodesMap[booking.statusId],
    }));
    console.log(result);
    res.render("doctor/pages/booking/index", {
      pageTitle: "Danh Sách Lịch Hẹn",
      bookings: result,

      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải danh sách lịch hẹn!");
    res.redirect(`${prefixDoctor}/dashboard`);
  }
};

module.exports.viewBookingDetail = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("patientId")
      .populate("scheduleId");

    if (!booking || booking.doctorId.toString() !== req.doctor._id.toString()) {
      req.flash(
        "error",
        "Không tìm thấy lịch hẹn hoặc bạn không có quyền xem!"
      );
      return res.redirect(`${prefixDoctor}/booking`);
    }
    statusCodes = await AllCode.find({ key: "status" });
    const allCodes = await AllCode.find();
    const allCodesMap = Object.fromEntries(
      allCodes.map((code) => [code.type, code.valueVi])
    );
    const result = {
      ...booking.toObject(),
      time: allCodesMap[booking.scheduleId.timeType],
      status: allCodesMap[booking.statusId],
    };
    res.render("doctor/pages/booking/detail", {
      pageTitle: "Chi Tiết Lịch Hẹn",
      booking: result,
      statusCodes: statusCodes,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải chi tiết lịch hẹn!");
    res.redirect(`${prefixDoctor}/booking`);
  }
};

module.exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.doctorId.toString() !== req.doctor._id.toString()) {
      req.flash(
        "error",
        "Không tìm thấy lịch hẹn hoặc bạn không có quyền cập nhật!"
      );
      return res.redirect(`${prefixDoctor}/booking`);
    }

    booking.statusId = status;
    await booking.save();

    req.flash("success", "Cập nhật trạng thái lịch hẹn thành công!");
    res.redirect(`${prefixDoctor}/booking/${req.params.id}`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật trạng thái lịch hẹn!");
    res.redirect("back");
  }
};
