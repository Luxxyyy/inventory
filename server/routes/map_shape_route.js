const express = require("express");
const router = express.Router();
const MapShape = require("../models/map_shape_model");

// GET all shapes
router.get("/", async (req, res) => {
  try {
    const shapes = await MapShape.findAll();
    res.json(shapes);
  } catch (error) {
    console.error("Error fetching shapes:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// POST new shape
router.post("/", async (req, res) => {
  try {
    const { type, geojson, radius } = req.body;
    if (!type || !geojson) {
      return res.status(400).json({ error: "Type and geojson are required" });
    }

    const shape = await MapShape.create({ type, geojson, radius });
    res.status(201).json(shape);
  } catch (error) {
    console.error("Error inserting shape:", error);
    res.status(500).json({ error: "Failed to insert shape" });
  }
});

module.exports = router;
