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

// DELETE shape by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await MapShape.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: "Shape deleted" });
    } else {
      res.status(404).json({ error: "Shape not found" });
    }
  } catch (error) {
    console.error("Error deleting shape:", error);
    res.status(500).json({ error: "Failed to delete shape" });
  }
});

module.exports = router;
