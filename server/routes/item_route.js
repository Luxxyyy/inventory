const express = require("express");
const router = express.Router();
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/item_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllItems);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
