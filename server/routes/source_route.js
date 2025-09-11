const express = require("express");
const router = express.Router();
const {
  getAllSources,
  createSource,
  updateSource,
  deleteSource,
} = require("../controllers/source_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllSources);
router.post("/", createSource);
router.put("/:id", updateSource);
router.delete("/:id", deleteSource);

module.exports = router;
