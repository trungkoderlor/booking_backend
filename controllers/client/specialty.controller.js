const Specialty = require("../../models/specialty.model");

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
    res.json(specialty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
