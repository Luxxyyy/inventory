const { logAction } = require("../utils/logger");
const Balangay = require("../models/balangay_model");
const Source = require("../models/source_model");

async function getAllBalangays(req, res) {
  try {
    const balangays = await Balangay.findAll({
      include: [{ model: Source, attributes: ["id", "source"] }],
      order: [["id", "ASC"]],
    });

    const response = balangays.map((b) => ({
      id: b.id,
      balangay: b.balangay,
      latitude: b.latitude,
      longitude: b.longitude,
      date_added: b.date_added,
      source_id: b.source_id,
      source_name: b.Source?.source || null,
    }));

    res.json(response);
  } catch (error) {
    console.error("Balangay fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

async function createBalangay(req, res) {
  try {
    const { balangay, source_id, longitude, latitude } = req.body;

    if (!balangay || !source_id || !longitude || !latitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const source = await Source.findByPk(source_id);
    if (!source) {
      return res.status(400).json({ error: "Invalid source_id" });
    }

    const newBalangay = await Balangay.create({
      balangay,
      source_id,
      longitude,
      latitude,
    });

    await logAction({
      action: "create",
      model: "Balangay",
      description: `Balangay '${balangay}' created`,
      userId: req.user.id,
    });

    res.status(201).json(newBalangay);
  } catch (error) {
    console.error("Balangay insert error:", error);
    res.status(500).json({ error: "Failed to insert balangay" });
  }
}

async function updateBalangay(req, res) {
  try {
    const { id } = req.params;
    const { balangay, source_id, latitude, longitude } = req.body;

    if (!balangay || !source_id || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingBalangay = await Balangay.findByPk(id);
    if (!existingBalangay)
      return res.status(404).json({ error: "Balangay not found" });

    const source = await Source.findByPk(source_id);
    if (!source) return res.status(400).json({ error: "Invalid source_id" });

    await existingBalangay.update({ balangay, source_id, latitude, longitude });

    await logAction({
      action: "update",
      model: "Balangay",
      description: `Balangay ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({
      message: "Balangay updated successfully",
      balangay: existingBalangay,
    });
  } catch (error) {
    console.error("Balangay update error:", error);
    res.status(500).json({ error: "Failed to update balangay" });
  }
}

async function deleteBalangay(req, res) {
  try {
    const { id } = req.params;
    const balangay = await Balangay.findByPk(id);
    if (!balangay) return res.status(404).json({ error: "Balangay not found" });

    await balangay.destroy();

    await logAction({
      action: "delete",
      model: "Balangay",
      description: `Balangay '${balangay.balangay}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Balangay deleted successfully" });
  } catch (error) {
    console.error("Balangay deletion error:", error);
    res.status(500).json({ error: "Failed to delete balangay" });
  }
}

module.exports = {
  getAllBalangays,
  createBalangay,
  updateBalangay,
  deleteBalangay,
};
