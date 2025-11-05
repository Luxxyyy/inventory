const express = require("express");
const router = express.Router();

const {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplier_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.get("/", getAllSuppliers);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
