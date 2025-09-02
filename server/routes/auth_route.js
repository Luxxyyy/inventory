const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/auth_controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth_middleware");

router.post("/register", isAuthenticated, isAdmin, register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/user", getCurrentUser);

module.exports = router;
