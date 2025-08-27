const express = require("express");
const router = express.Router();
const Source = require("../models/source_model");

// GET /api/sources
router.get("/", async (req, res) => {
  try {
    const sources = await Source.findAll();
    res.json(sources);
  } catch (error) {
    console.error("Sequelize error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/sources
router.post("/", async (req, res) => {
  try {
    const { balangay, source, latitude, longitude } = req.body;
    if (!balangay || !source || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newSource = await Source.create({
      balangay,
      source,
      latitude,
      longitude,
    });
    res.status(201).json(newSource);
  } catch (error) {
    console.error("Error inserting source:", error.message);
    res.status(500).json({ error: "Failed to insert source" });
  }
});

module.exports = router;
