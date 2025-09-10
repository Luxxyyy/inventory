const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser } = require("../controllers/auth_controller");

const { isAuthenticated, isAdmin } = require("../middleware/auth_middleware");

router.get("/", isAuthenticated, isAdmin, getAllUsers);

router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

module.exports = router;
