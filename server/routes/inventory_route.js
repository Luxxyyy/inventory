const express = require("express");
const router = express.Router();
const {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventory_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllInventory);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

module.exports = router;
