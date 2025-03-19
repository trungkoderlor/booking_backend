const dashboardRoutes = require("./dashboard.route");
const userRoutes = require("./user.route");
const specialtyRoutes = require("./specialty.route");
const clinicRoutes = require("./clinic.route");
const postRoutes = require("./post.route");
const bookingRoutes = require("./booking.route");
const systemconfig = require("../../config/system");

module.exports = (app) => {
  PATH_ADMIN = systemconfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/users", userRoutes);
  app.use(PATH_ADMIN + "/specialties", specialtyRoutes);
  app.use(PATH_ADMIN + "/clinics", clinicRoutes);
  app.use(PATH_ADMIN + "/posts", postRoutes);
  app.use(PATH_ADMIN + "/bookings", bookingRoutes);
};
