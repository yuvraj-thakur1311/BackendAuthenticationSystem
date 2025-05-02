exports.authorize = (role) => (req, res, next) => {
  console.log("Required role:", role);
  console.log("User role from token:", req.user.role);
  if (req.user?.role !== role) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource.",
    });
  }
  next();
};
