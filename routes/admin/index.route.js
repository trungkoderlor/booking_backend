const dashboardRoutes = require("./dashboard.route");
const userRoutes = require("./user.route");
const specialtyRoutes = require("./specialty.route");
const clinicRoutes = require("./clinic.route");
const postRoutes = require("./post.route");
const bookingRoutes = require("./booking.route");
const authRoutes = require("./auth.route");
const systemconfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
module.exports = (app) => {
  PATH_ADMIN = systemconfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", authMiddleware, dashboardRoutes);
  app.use(PATH_ADMIN + "/users", authMiddleware, userRoutes);
  app.use(PATH_ADMIN + "/specialties", authMiddleware, specialtyRoutes);
  app.use(PATH_ADMIN + "/clinics", authMiddleware, clinicRoutes);
  app.use(PATH_ADMIN + "/posts", authMiddleware, postRoutes);
  app.use(PATH_ADMIN + "/bookings", authMiddleware, bookingRoutes);
  app.use(PATH_ADMIN + "/auth", authRoutes);
};
