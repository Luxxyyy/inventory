const express = require("express");
const router = express.Router();
const {
  createPurok,
  updatePurok,
  deletePurok,
  getAllPuroks,
} = require("../controllers/purok_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllPuroks);

router.post("/", createPurok);
router.put("/:id", updatePurok);
router.delete("/:id", deletePurok);

module.exports = router;
