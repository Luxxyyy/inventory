// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};

// Middleware to check if user is authenticated and attach user to request
const attachUser = (req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  attachUser,
};
