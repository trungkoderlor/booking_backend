const SpecialtyRoutes = require("./specialty.route");
const ClinicRoutes = require("./clinic.route");
const DoctorRoutes = require("./doctor.route");
const AuthRoutes = require("./auth.route");
const BookingRoutes = require("./booking.route");
const UserRoutes = require("./user.route");

module.exports = (app) => {
  app.use("/api/specialties", SpecialtyRoutes);
  app.use("/api/clinics", ClinicRoutes);
  app.use("/api/doctors", DoctorRoutes);
  app.use("/api/auth", AuthRoutes);
  app.use("/api/bookings", BookingRoutes);
  app.use("/api/users", UserRoutes);
};
