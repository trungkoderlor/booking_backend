const SpecialtyRoutes = require("./specialty.route");
const ClinicRoutes = require("./clinic.route");
const DoctorRoutes = require("./doctor.route");
const AuthRoutes = require("./auth.route");
module.exports = (app) => {
  app.use("/api/specialties", SpecialtyRoutes);
  app.use("/api/clinics", ClinicRoutes);
  app.use("/api/doctors", DoctorRoutes);
  app.use("/auth", AuthRoutes);
};
