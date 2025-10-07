const express = require("express");
const router = express.Router();

const {
  getAllSheets,
  createSheet,
  updateSheet,
  deleteSheet,
} = require("../controllers/sheet_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllSheets);
router.post("/", createSheet);
router.put("/:id", updateSheet);
router.delete("/:id", deleteSheet);

module.exports = router;
