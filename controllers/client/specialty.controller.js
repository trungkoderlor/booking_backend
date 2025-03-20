const Specialty = require("../../models/specialty.model");
const Doctor = require("../../models/doctor.model");
const Clinic = require("../../models/clinic.model");
//[GET] /api/specialties
module.exports.index = async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [GET] /api/specialties/:slug
module.exports.detail = async (req, res) => {
  const { slug } = req.params;
  try {
    const specialty = await Specialty.findOne({ slug });
    const doctors = await Doctor.find({
      specialties: { $in: [specialty._id] },
    }).populate("userId");
    const newDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        const clinic = await Clinic.findOne({ _id: doctor.clinics });
        const doctorWithDetails = {
          ...doctor.toObject(),
          clinic: clinic,
        };
        return doctorWithDetails;
      })
    );
    const data = {
      ...specialty.toObject(),
      doctors: newDoctors,
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
