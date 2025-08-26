const express = require("express");
const router = express.Router();
const PipeLog = require("../models/pipe_log_model");
const MapShape = require("../models/map_shape_model");

router.get("/:shapeId/logs", async (req, res) => {
  try {
    const logs = await PipeLog.findAll({
      where: { shape_id: req.params.shapeId },
      order: [["created_at", "DESC"]],
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching pipe logs:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/:shapeId/logs", async (req, res) => {
  try {
    const { size, remarks } = req.body;
    const { shapeId } = req.params;

    if (!size) {
      return res.status(400).json({ error: "Size is required" });
    }

    const shape = await MapShape.findByPk(shapeId);
    if (!shape) {
      return res.status(404).json({ error: "Shape not found" });
    }

    shape.size = size;
    await shape.save();

    const log = await PipeLog.create({
      shape_id: shapeId,
      size,
      remarks,
    });

    res.status(201).json({ message: "Log added and size updated", log });
  } catch (error) {
    console.error("Error adding pipe log:", error);
    res.status(500).json({ error: "Failed to add pipe log" });
  }
});

module.exports = router;
