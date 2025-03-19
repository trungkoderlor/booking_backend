const Clinic = require("../../models/clinic.model");
//[GET] /api/specialties
module.exports.index = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
