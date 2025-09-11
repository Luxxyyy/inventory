const Source = require("../models/source_model");
const { logAction } = require("../utils/logger");

async function getAllSources(req, res) {
  try {
    const sources = await Source.findAll({ order: [["id", "ASC"]] });
    res.json(sources);
  } catch (error) {
    console.error("Error fetching sources:", error);
    res.status(500).json({ error: "Database error" });
  }
}

async function createSource(req, res) {
  try {
    const { source, latitude, longitude } = req.body;

    // Validate required fields
    if (!source || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Optional: log body for debugging
    console.log("Create Source - Body:", req.body);
    console.log("User:", req.user);

    const newSource = await Source.create({ source, latitude, longitude });

    // Defensive check for userId
    const userId = req.user?.id || null;

    if (userId) {
      await logAction({
        action: "create",
        model: "Source",
        description: `Source '${source}' created`,
        userId,
      });
    } else {
      console.warn("User ID missing. Skipping log.");
    }

    res.status(201).json(newSource);
  } catch (error) {
    console.error("Source create error:", error);
    res.status(500).json({ error: "Failed to create source" });
  }
}

async function updateSource(req, res) {
  try {
    const { id } = req.params;
    const { source, latitude, longitude } = req.body;

    if (!source || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingSource = await Source.findByPk(id);
    if (!existingSource) {
      return res.status(404).json({ error: "Source not found" });
    }

    await existingSource.update({ source, latitude, longitude });

    const userId = req.user?.id || null;

    if (userId) {
      await logAction({
        action: "update",
        model: "Source",
        description: `Source ID ${id} updated`,
        userId,
      });
    } else {
      console.warn("User ID missing. Skipping log.");
    }

    res.json({
      message: "Source updated successfully",
      source: existingSource,
    });
  } catch (error) {
    console.error("Source update error:", error);
    res.status(500).json({ error: "Failed to update source" });
  }
}

async function deleteSource(req, res) {
  try {
    const { id } = req.params;

    const source = await Source.findByPk(id);
    if (!source) {
      return res.status(404).json({ error: "Source not found" });
    }

    await source.destroy();

    const userId = req.user?.id || null;

    if (userId) {
      await logAction({
        action: "delete",
        model: "Source",
        description: `Source '${source.source}' deleted`,
        userId,
      });
    } else {
      console.warn("User ID missing. Skipping log.");
    }

    res.json({ message: "Source deleted successfully" });
  } catch (error) {
    console.error("Source deletion error:", error);
    res.status(500).json({ error: "Failed to delete source" });
  }
}

module.exports = {
  getAllSources,
  createSource,
  updateSource,
  deleteSource,
};
