const express = require("express");
const router = express.Router();
const {
  getAllBalangays,
  createBalangay,
  updateBalangay,
  deleteBalangay,
} = require("../controllers/balangay_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllBalangays);
router.post("/", createBalangay);
router.put("/:id", updateBalangay);
router.delete("/:id", deleteBalangay);

module.exports = router;
