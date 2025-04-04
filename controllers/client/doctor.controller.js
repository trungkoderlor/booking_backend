const Doctor = require("../../models/doctor.model");
const User = require("../../models/user.model");
const Specialty = require("../../models/specialty.model");
const Clinic = require("../../models/clinic.model");
const Schedule = require("../../models/schedule.model");
const AllCode = require("../../models/allcode.model");
const Booking = require("../../models/booking.model");
//[GET] /api/doctors
module.exports.index = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId");

    const newDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        const specialties = await Specialty.find({
          _id: { $in: doctor.specialties },
        });
        const clinic = await Clinic.findOne({ _id: doctor.clinics });
        const doctorWithDetails = {
          ...doctor.toObject(),
          specialty: specialties,
          clinic: clinic,
        };
        return doctorWithDetails;
      })
    );
    res.json(newDoctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [GET] /api/doctors/:slug
module.exports.detail = async (req, res) => {
  const { slug } = req.params;
  try {
    const user = await User.findOne({ slug: slug });
    const doctor = await Doctor.findOne({ userId: user._id });
    const specialties = await Specialty.find({
      _id: { $in: doctor.specialties },
    });
    const schedule = await Schedule.find({ doctorId: doctor._id });

    const newSchedule = await Promise.all(
      schedule.map(async (item) => {
        const allcode = await AllCode.findOne({
          key: "time",
          type: item.timeType,
        });
        item.timeType = allcode.valueVi;
        return item;
      })
    );
    const clinic = await Clinic.findById(doctor.clinics);
    const doctorWithDetails = {
      ...user.toObject(),
      ...doctor.toObject(),
      specialty: specialties,
      clinic: clinic,
      schedule: schedule,
    };

    res.json(doctorWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [GET] /api/doctors/:slug/schedule/:schedule_id
module.exports.schedule = async (req, res) => {
  const { slug, schedule_id } = req.params;
  try {
    const schedule = await Schedule.findById(schedule_id);
    const timeType = await AllCode.findOne({
      key: "time",
      type: schedule.timeType,
    });
    const newSchedule = {
      ...schedule.toObject(),
      timeValue: timeType.valueVi,
    };
    res.json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
