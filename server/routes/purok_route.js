const express = require("express");
const router = express.Router();
const Purok = require("../models/purok_model");

// GET /api/puroks
router.get("/", async (req, res) => {
  try {
    const puroks = await Purok.findAll();
    res.json(puroks);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/puroks
router.post("/", async (req, res) => {
  try {
    const { purok, balangay, source, latitude, longitude } = req.body;
    if (!purok || !balangay || !source || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newPurok = await Purok.create({
      purok,
      balangay,
      source,
      latitude,
      longitude,
    });
    res.status(201).json(newPurok);
  } catch (error) {
    res.status(500).json({ error: "Failed to insert purok" });
  }
});

module.exports = router;
