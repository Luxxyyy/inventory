const express = require("express");
const router = express.Router();
const controller = require("../controllers/map_shape_controller");
const { isAuthenticated } = require("../middleware/auth_middleware");

router.get("/", controller.getAllShapes);

router.post("/", isAuthenticated, controller.createShape);
router.put("/:id", isAuthenticated, controller.updateShape);
router.delete("/:id", isAuthenticated, controller.deleteShape);

module.exports = router;
