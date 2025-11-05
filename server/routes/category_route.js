const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
