const Schedule = require("../../models/schedule.model");
const AllCode = require("../../models/allcode.model");
const systemconfig = require("../../config/system");

module.exports.viewSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      doctorId: req.doctor._id,
      deleted: false,
    }).sort({ date: 1 });
    const allCodes = await AllCode.find({ key: "time" });
    const allCodesMap = Object.fromEntries(
      allCodes.map((code) => [code.type, code.valueVi])
    );
    const result = schedules.map((schedule) => ({
      ...schedule.toObject(),
      time: allCodesMap[schedule.timeType],
    }));
    res.render("doctor/pages/schedule/schedules", {
      pageTitle: "Lịch Khám Của Tôi",
      schedules: result,
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải lịch khám!");
    res.redirect(`${systemconfig.prefixDoctor}/dashboard`);
  }
};

module.exports.createSchedule = async (req, res) => {
  try {
    const schedules = await AllCode.find({ key: "time" });
    res.render("doctor/pages/schedule/create", {
      pageTitle: "Đăng ký lịch rảnh",
      expressFlash: {
        success: req.flash("success"),
        error: req.flash("error"),
      },
      schedules: schedules,
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi tải trang tạo lịch!");
    res.redirect(`${systemconfig.prefixDoctor}/schedule`);
  }
};

module.exports.createSchedulePost = async (req, res) => {
  try {
    const schedule = new Schedule({
      doctorId: req.doctor._id,
      date: req.body.date,
      timeType: req.body.timeType,
      maxNumber: req.body.maxNumber,
      currentNumber: 0,
    });
    await schedule.save();
    req.flash("success", "Đăng ký lịch rảnh thành công!");
    res.redirect(`${systemconfig.prefixDoctor}/schedule`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi đăng ký lịch rảnh!");
    res.redirect("back");
  }
};

module.exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (
      !schedule ||
      schedule.doctorId.toString() !== req.doctor._id.toString()
    ) {
      req.flash("error", "Không tìm thấy lịch hoặc bạn không có quyền xóa!");
      return res.redirect(`${systemconfig.prefixDoctor}/schedule`);
    }
    schedule.deleted = true;
    await schedule.save();

    req.flash("success", "Xóa lịch khám thành công!");
    res.redirect(`${systemconfig.prefixDoctor}/schedule`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi xóa lịch khám!");
    res.redirect("back");
  }
};
