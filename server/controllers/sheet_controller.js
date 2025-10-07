const { logAction } = require("../utils/logger");
const Sheet = require("../models/sheet_model");
const Source = require("../models/source_model");

async function getAllSheets(req, res) {
  try {
    const sheets = await Sheet.findAll({
      include: [{ model: Source, attributes: ["id", "source"] }],
      order: [["id", "ASC"]],
    });

    const response = sheets.map((s) => ({
      id: s.id,
      sheet_name: s.sheet_name,
      latitude: s.latitude,
      longitude: s.longitude,
      date_added: s.date_added,
      source_id: s.source_id,
      source_name: s.Source?.source || null,
    }));

    res.json(response);
  } catch (error) {
    console.error("Sheet fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

async function createSheet(req, res) {
  try {
    const { sheet_name, source_id, longitude, latitude } = req.body;

    if (!sheet_name || !source_id || !longitude || !latitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const source = await Source.findByPk(source_id);
    if (!source) {
      return res.status(400).json({ error: "Invalid source_id" });
    }

    const newSheet = await Sheet.create({
      sheet_name,
      source_id,
      longitude,
      latitude,
    });

    await logAction({
      action: "create",
      model: "Sheet",
      description: `Sheet '${sheet_name}' created`,
      userId: req.user.id,
    });

    res.status(201).json(newSheet);
  } catch (error) {
    console.error("Sheet insert error:", error);
    res.status(500).json({ error: "Failed to insert sheet" });
  }
}

async function updateSheet(req, res) {
  try {
    const { id } = req.params;
    const { sheet_name, source_id, latitude, longitude } = req.body;

    if (!sheet_name || !source_id || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingSheet = await Sheet.findByPk(id);
    if (!existingSheet)
      return res.status(404).json({ error: "Sheet not found" });

    const source = await Source.findByPk(source_id);
    if (!source) return res.status(400).json({ error: "Invalid source_id" });

    await existingSheet.update({ sheet_name, source_id, latitude, longitude });

    await logAction({
      action: "update",
      model: "Sheet",
      description: `Sheet ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({
      message: "Sheet updated successfully",
      sheet: existingSheet,
    });
  } catch (error) {
    console.error("Sheet update error:", error);
    res.status(500).json({ error: "Failed to update sheet" });
  }
}

async function deleteSheet(req, res) {
  try {
    const { id } = req.params;
    const sheet = await Sheet.findByPk(id);
    if (!sheet) return res.status(404).json({ error: "Sheet not found" });

    await sheet.destroy();

    await logAction({
      action: "delete",
      model: "Sheet",
      description: `Sheet '${sheet.sheet_name}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Sheet deleted successfully" });
  } catch (error) {
    console.error("Sheet deletion error:", error);
    res.status(500).json({ error: "Failed to delete sheet" });
  }
}

module.exports = {
  getAllSheets,
  createSheet,
  updateSheet,
  deleteSheet,
};
