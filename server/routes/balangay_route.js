const express = require("express");
const router = express.Router();
const Balangay = require("../models/balangay_model");

// GET /api/balangays
router.get("/", async (req, res) => {
  try {
    const balangays = await Balangay.findAll();
    res.json(balangays);
  } catch (error) {
    console.error("Balangay fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/balangays
router.post("/", async (req, res) => {
  try {
    console.log("Incoming POST body:", req.body);
    const { balangay, source, longitude, latitude } = req.body;

    if (!balangay || !source || !longitude || !latitude) {
      console.warn("Validation failed: missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBalangay = await Balangay.create({
      balangay,
      source,
      longitude,
      latitude,
    });

    console.log("Inserted new balangay:", newBalangay.toJSON());
    res.status(201).json(newBalangay);
  } catch (error) {
    console.error("Balangay insert error:", error);
    res.status(500).json({ error: "Failed to insert balangay" });
  }
});

module.exports = router;
