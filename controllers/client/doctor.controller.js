const Doctor = require("../../models/doctor.model");
const User = require("../../models/user.model");
const Specialty = require("../../models/specialty.model");
const Clinic = require("../../models/clinic.model");
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
    console.log(newDoctors);
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
    const clinic = await Clinic.findById(doctor.clinics);
    const doctorWithDetails = {
      ...user.toObject(),
      ...doctor.toObject(),
      specialty: specialties,
      clinic: clinic,
    };

    res.json(doctorWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
