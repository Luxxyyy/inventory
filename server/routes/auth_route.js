const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/auth_controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth_middleware");

// POST /api/auth/register - Register a new user (admin only)
router.post("/register", isAuthenticated, isAdmin, register);

// POST /api/auth/login - Login user
router.post("/login", login);

// POST /api/auth/logout - Logout user
router.post("/logout", logout);

// GET /api/auth/user - Get current user
router.get("/user", getCurrentUser);

module.exports = router;
