const express = require("express");
const router = express.Router();
const LegendItem = require("../models/legend_item_model");

router.get("/", async (req, res) => {
  try {
    const items = await LegendItem.findAll({
      order: [
        ["type", "ASC"],
        ["label", "ASC"],
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching legend items:", error);
    res.status(500).json({ error: "Failed to fetch legend items." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { label, type, color, cssClass } = req.body;

    if (!label || !type || !color) {
      return res
        .status(400)
        .json({ error: "Label, type, and color are required." });
    }

    const newItem = await LegendItem.create({ label, type, color, cssClass });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating legend item:", error);
    res.status(500).json({ error: "Failed to create legend item." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await LegendItem.findByPk(req.params.id);
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: "Legend item not found." });
    }
  } catch (error) {
    console.error("Error fetching legend item:", error);
    res.status(500).json({ error: "Failed to fetch legend item." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { label, type, color, cssClass } = req.body;
    const item = await LegendItem.findByPk(req.params.id);
    if (item) {
      item.label = label || item.label;
      item.type = type || item.type;
      item.color = color || item.color;
      item.cssClass = cssClass || item.cssClass;
      await item.save();
      res.status(200).json(item);
    } else {
      res.status(404).json({ error: "Legend item not found." });
    }
  } catch (error) {
    console.error("Error updating legend item:", error);
    res.status(500).json({ error: "Failed to update legend item." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const item = await LegendItem.findByPk(req.params.id);
    if (item) {
      await item.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Legend item not found." });
    }
  } catch (error) {
    console.error("Error deleting legend item:", error);
    res.status(500).json({ error: "Failed to delete legend item." });
  }
});

module.exports = router;
