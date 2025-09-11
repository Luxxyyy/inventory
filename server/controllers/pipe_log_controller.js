const PipeLog = require("../models/pipe_log_model");
const MapShape = require("../models/map_shape_model");
const { logAction } = require("../utils/logger");

exports.getLogsByShape = async (req, res) => {
  try {
    const { shapeId } = req.params;
    const logs = await PipeLog.findAll({
      where: { shape_id: shapeId },
      order: [["created_at", "DESC"]],
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

exports.addLog = async (req, res) => {
  try {
    const { shapeId } = req.params;
    const { size, remarks } = req.body;

    const shape = await MapShape.findByPk(shapeId);
    if (!shape) return res.status(404).json({ error: "Shape not found" });

    shape.size = size;
    await shape.save();

    const pipeLog = await PipeLog.create({
      shape_id: shapeId,
      size,
      remarks,
    });

    await logAction({
      action: "update",
      model: shape.type || "Shape",
      description: shape.title || `Updated shape with ID ${shapeId}`,
      userId: req.user?.id || null,
    });

    res.status(201).json(pipeLog);
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: "Failed to create log" });
  }
};
