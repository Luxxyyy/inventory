const MapShape = require("../models/map_shape_model");
const { logAction } = require("../utils/logger");

// Get all shapes
exports.getAllShapes = async (req, res) => {
  try {
    const shapes = await MapShape.findAll();
    res.json(shapes);
  } catch (error) {
    console.error("Error fetching shapes:", error);
    res.status(500).json({ error: "Failed to fetch shapes" });
  }
};

// Create shape
exports.createShape = async (req, res) => {
  try {
    const { type, geojson, radius, title, description, status, color, size } =
      req.body;

    const shape = await MapShape.create({
      type,
      geojson,
      radius,
      title,
      description,
      status,
      color,
      size,
    });

    await logAction({
      action: "create",
      model: type || "Shape",
      description: title || `Created shape with ID ${shape.id}`,
      userId: req.user?.id || null,
    });

    res.status(201).json(shape);
  } catch (error) {
    console.error("Error creating shape:", error);
    res.status(500).json({ error: "Failed to create shape" });
  }
};

// Update shape
exports.updateShape = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const shape = await MapShape.findByPk(id);
    if (!shape) return res.status(404).json({ error: "Shape not found" });

    await shape.update(updates);

    await logAction({
      action: "update",
      model: shape.type || "Shape",
      description: shape.title || `Updated shape with ID ${id}`,
      userId: req.user?.id || null,
    });

    res.status(200).json(shape);
  } catch (error) {
    console.error("Error updating shape:", error);
    res.status(500).json({ error: "Failed to update shape" });
  }
};

// Delete shape
exports.deleteShape = async (req, res) => {
  try {
    const { id } = req.params;
    const shape = await MapShape.findByPk(id);
    if (!shape) return res.status(404).json({ error: "Shape not found" });

    await shape.destroy();

    await logAction({
      action: "delete",
      model: shape.type || "Shape",
      description: shape.title || `Deleted shape with ID ${id}`,
      userId: req.user?.id || null,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting shape:", error);
    res.status(500).json({ error: "Failed to delete shape" });
  }
};
