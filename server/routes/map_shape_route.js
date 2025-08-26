const express = require("express");
const router = express.Router();
const MapShape = require("../models/map_shape_model");

router.get("/", async (req, res) => {
  try {
    const shapes = await MapShape.findAll();
    res.json(shapes);
  } catch (error) {
    console.error("Error fetching shapes:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { type, geojson, radius, title, description, status, color } =
      req.body;
    if (!type || !geojson) {
      return res.status(400).json({ error: "Type and geojson are required" });
    }
    const shape = await MapShape.create({
      type,
      geojson,
      radius,
      title,
      description,
      status,
      color,
    });
    res.status(201).json(shape);
  } catch (error) {
    console.error("Error inserting shape:", error);
    res.status(500).json({ error: "Failed to insert shape" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { type, geojson, radius, title, description, status, color } =
      req.body;
    const shape = await MapShape.findByPk(req.params.id);
    if (!shape) return res.status(404).json({ error: "Shape not found" });
    await shape.update({
      type,
      geojson,
      radius,
      title,
      description,
      status,
      color,
    });
    res.json(shape);
  } catch (error) {
    console.error("Error updating shape:", error);
    res.status(500).json({ error: "Failed to update shape" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MapShape.destroy({ where: { id: req.params.id } });
    deleted
      ? res.json({ message: "Shape deleted" })
      : res.status(404).json({ error: "Shape not found" });
  } catch (error) {
    console.error("Error deleting shape:", error);
    res.status(500).json({ error: "Failed to delete shape" });
  }
});

module.exports = router;
