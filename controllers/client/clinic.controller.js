const Clinic = require("../../models/clinic.model");
const Doctor = require("../../models/doctor.model");
const Specialty = require("../../models/specialty.model");
//[GET] /api/clinics
module.exports.index = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//[GET] /api/clinics/:slug
module.exports.detail = async (req, res) => {
  try {
    const clinic = await Clinic.findOne({ slug: req.params.slug });
    const doctors = await Doctor.find({ clinics: clinic._id }).populate(
      "userId"
    );
    const newDoctors = await Promise.all(
      doctors.map(async (doctor) => {
        const specialties = await Specialty.find({
          _id: { $in: doctor.specialties },
        });
        const doctorWithDetails = {
          ...doctor.toObject(),
          specialty: specialties,
          clinic: clinic,
        };
        return doctorWithDetails;
      })
    );
    const data = {
      ...clinic.toObject(),
      doctors: newDoctors,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
