const AuthRoutes = require("./auth.route");
const ProfileRoutes = require("./profile.route");
const ScheduleRoutes = require("./schedule.route");
const DashboardRoutes = require("./dashboard.route");
const BookingRoutes = require("./booking.route");
const systemconfig = require("../../config/system");
const authMiddleware = require("../../middlewares/doctor/auth.middleware");
module.exports = (app) => {
  app.use(systemconfig.prefixDoctor + "/auth", AuthRoutes);
  app.use(
    systemconfig.prefixDoctor + "/profile",
    authMiddleware,
    ProfileRoutes
  );
  app.use(
    systemconfig.prefixDoctor + "/schedule",
    authMiddleware,
    ScheduleRoutes
  );
  app.use(
    systemconfig.prefixDoctor + "/dashboard",
    authMiddleware,
    DashboardRoutes
  );
  app.use(
    systemconfig.prefixDoctor + "/booking",
    authMiddleware,
    BookingRoutes
  );
};
