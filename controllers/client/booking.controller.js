const Booking = require("../../models/booking.model");
const Doctor = require("../../models/doctor.model");
const User = require("../../models/user.model");
const AllCode = require("../../models/allcode.model");
const { sendMail } = require("../../helpers/sendMail");

// [GET] /api/bookings
module.exports.index = async (req, res) => {
  try {
    const userId = req.user.id;

    // Chạy song song hai truy vấn
    const [bookings, allCodes] = await Promise.all([
      Booking.find({ patientId: userId })
        .populate({
          path: "doctorId",
          populate: [{ path: "userId" }, { path: "clinics" }],
        })
        .populate("scheduleId"),
      AllCode.find(),
    ]);

    // Tạo object lookup để lấy valueVi nhanh hơn
    const allCodesMap = Object.fromEntries(
      allCodes.map((code) => [code.type, code.valueVi])
    );

    // Ánh xạ lại bookings với thông tin từ allCodesMap
    const result = bookings.map((booking) => ({
      ...booking.toObject(),
      scheduleId: {
        ...booking.scheduleId?.toObject(),
        time: allCodesMap[booking.scheduleId?.timeType],
      },
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
    const doctor = await Doctor.findOne().populate({
      path: "userId",
      match: { slug: doctor_slug },
    });
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
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
