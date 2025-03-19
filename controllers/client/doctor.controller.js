const Doctor = require("../../models/doctor.model");
const User = require("../../models/user.model");
//[GET] /api/doctors
module.exports.index = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId");
    console.log(doctors);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [GET] /api/doctors/:slug
module.exports.detail = async (req, res) => {
  const { slug } = req.params;
  try {
    const doctor = await Doctor.findOne({ slug });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
