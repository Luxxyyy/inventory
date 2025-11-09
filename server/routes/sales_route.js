const express = require("express");
const router = express.Router();
const { createSale, getSales } = require("../controllers/sales_controller");

router.use((req, res, next) => { req.user = req.user || { id: 1 }; next(); });

router.get("/", getSales);
router.post("/", createSale);

module.exports = router;
