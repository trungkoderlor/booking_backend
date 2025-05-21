const Booking = require("../../models/booking.model");
const Doctor = require("../../models/doctor.model");
const User = require("../../models/user.model");
const AllCode = require("../../models/allcode.model");
const { sendMail } = require("../../helpers/sendMail");
const Schedule = require("../../models/schedule.model");
// [GET] /api/bookings
module.exports.index = async (req, res) => {
  try {
    const userId = req.user.id;

    const [bookings, allCodes] = await Promise.all([
      Booking.find({ patientId: userId })
        .populate({
          path: "doctorId",
          populate: [{ path: "userId" }, { path: "clinics" }],
        })
        .populate("scheduleId")
        .sort({ createdAt: -1 }),
      AllCode.find(),
    ]);

    const allCodesMap = Object.fromEntries(
      allCodes.map((code) => [code.type, code.valueVi])
    );

    const result = bookings.map((booking) => ({
      ...booking.toObject(),
      scheduleId: {
        ...booking.scheduleId?.toObject(),
        time: allCodesMap[booking.scheduleId?.timeType],
      },
      status: allCodesMap[booking.statusId],
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [GET] /api/bookings/:id
module.exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const [booking, allCodes] = await Promise.all([
      Booking.findOne({ _id: id })
        .populate({
          path: "doctorId",
          populate: [{ path: "userId" }, { path: "clinics" }],
        })
        .populate("scheduleId"),
      AllCode.find(),
    ]);
    const allCodesMap = Object.fromEntries(
      allCodes.map((code) => [code.type, code.valueVi])
    );
    const result = {
      ...booking.toObject(),
      scheduleId: {
        ...booking.scheduleId?.toObject(),
        time: allCodesMap[booking.scheduleId?.timeType],
      },
      status: allCodesMap[booking.statusId],
    };
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/bookings/create

module.exports.create = async (req, res) => {
  try {
    const { email, fullname, phone, address, birthyear, gender, reasons } =
      req.body.info;
    const { doctor_slug, schedule_id } = req.body;
    // const existingBooking = await Booking.findOne({
    //   scheduleId: schedule_id,
    //   patientId: req.user.id,
    // });
    // if (existingBooking) {
    //   return res.status(400).json({ message: "Bạn đã đặt lịch này rồi!" });
    // }
    const maxNumber = await Schedule.findById(schedule_id);
    if (maxNumber.currentNumber >= maxNumber.maxNumber) {
      return res.status(400).json({ message: "Lịch đã đủ số lượng!" });
    }
    const user = await User.findOne({ slug: doctor_slug });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bác sĩ với slug này!" });
    }

    // Sau đó tìm doctor có userId là _id của user vừa tìm được
    const doctor = await Doctor.findOne({ userId: user._id })
      .populate("userId")
      .populate("clinics");

    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin bác sĩ!" });
    }
    const userId = req.user.id;
    const booking = new Booking({
      statusId: "S1",
      doctorId: doctor._id,
      patientId: userId,
      scheduleId: schedule_id,
      info: {
        email,
        fullname,
        phone,
        address,
        birthyear,
        gender,
        reasons,
      },
    });
    await booking.save();
    await Schedule.findByIdAndUpdate(schedule_id, {
      $inc: { currentNumber: 1 },
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
