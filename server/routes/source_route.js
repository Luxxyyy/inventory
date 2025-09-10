const express = require("express");
const router = express.Router();
const Source = require("../models/source_model");

// GET /api/sources - Get all sources
router.get("/", async (req, res) => {
  try {
    const sources = await Source.findAll();
    res.json(sources);
  } catch (error) {
    console.error("Sequelize error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/sources/:id - Get source by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const source = await Source.findByPk(id);
    if (!source) {
      return res.status(404).json({ error: "Source not found" });
    }
    res.json(source);
  } catch (error) {
    console.error("Error fetching source:", error.message);
    res.status(500).json({ error: "Failed to fetch source" });
  }
});

// POST /api/sources - Create new source
router.post("/", async (req, res) => {
  try {
    const { source, latitude, longitude } = req.body;
    if (!source || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newSource = await Source.create({ source, latitude, longitude });
    res.status(201).json(newSource);
  } catch (error) {
    console.error("Error inserting source:", error.message);
    res.status(500).json({ error: "Failed to insert source" });
  }
});

// PUT /api/sources/:id - Update source by ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { source, latitude, longitude } = req.body;

    if (!source || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingSource = await Source.findByPk(id);
    if (!existingSource) {
      return res.status(404).json({ error: "Source not found" });
    }

    await existingSource.update({ source, latitude, longitude });
    res.json(existingSource);
  } catch (error) {
    console.error("Error updating source:", error.message);
    res.status(500).json({ error: "Failed to update source" });
  }
});

// DELETE /api/sources/:id - Delete source by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existingSource = await Source.findByPk(id);

    if (!existingSource) {
      return res.status(404).json({ error: "Source not found" });
    }

    await existingSource.destroy();
    res.json({ message: "Source deleted successfully" });
  } catch (error) {
    console.error("Error deleting source:", error.message);
    res.status(500).json({ error: "Failed to delete source" });
  }
});

module.exports = router;
