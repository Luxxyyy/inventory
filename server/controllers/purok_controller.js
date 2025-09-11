const { logAction } = require("../utils/logger");
const Purok = require("../models/purok_model");
const Balangay = require("../models/balangay_model");
const Source = require("../models/source_model");

async function getAllPuroks(req, res) {
  try {
    const puroks = await Purok.findAll({
      include: [
        {
          model: Balangay,
          attributes: ["id", "balangay"],
        },
        {
          model: Source,
          attributes: ["id", "source"],
        },
      ],
      order: [["id", "ASC"]],
    });

    const formatted = puroks.map((p) => ({
      id: p.id,
      purok: p.purok,
      latitude: p.latitude,
      longitude: p.longitude,
      date_added: p.date_added,
      balangay_id: p.balangay_id,
      balangay_name: p.Balangay?.balangay || "",
      source_id: p.source_id,
      source_name: p.Source?.source || "",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching puroks:", err);
    res.status(500).json({ error: "Failed to fetch puroks" });
  }
}

async function createPurok(req, res) {
  try {
    const { purok, balangay_id, source_id, latitude, longitude } = req.body;

    if (!purok || !balangay_id || !source_id || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const balangay = await Balangay.findByPk(balangay_id);
    const source = await Source.findByPk(source_id);

    if (!balangay)
      return res.status(400).json({ error: "Invalid balangay_id" });
    if (!source) return res.status(400).json({ error: "Invalid source_id" });

    const newPurok = await Purok.create({
      purok,
      balangay_id,
      source_id,
      latitude,
      longitude,
    });

    await logAction({
      action: "create",
      model: "Purok",
      description: `Purok '${purok}' created in Balangay ID ${balangay_id}`,
      userId: req.user.id,
    });

    res.status(201).json(newPurok);
  } catch (error) {
    console.error("Error creating purok:", error);
    res.status(500).json({ error: "Failed to insert purok" });
  }
}

async function updatePurok(req, res) {
  try {
    const { purok, latitude, longitude, balangay_id, source_id } = req.body;
    const { id } = req.params;

    if (!purok || !latitude || !longitude || !balangay_id || !source_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const purokItem = await Purok.findByPk(id);
    if (!purokItem) return res.status(404).json({ error: "Purok not found" });

    await purokItem.update({
      purok,
      latitude,
      longitude,
      balangay_id,
      source_id,
    });

    await logAction({
      action: "update",
      model: "Purok",
      description: `Purok ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({ message: "Purok updated successfully" });
  } catch (error) {
    console.error("Error updating purok:", error);
    res.status(500).json({ error: "Update failed" });
  }
}

async function deletePurok(req, res) {
  try {
    const { id } = req.params;
    const purok = await Purok.findByPk(id);
    if (!purok) return res.status(404).json({ error: "Purok not found" });

    await purok.destroy();

    await logAction({
      action: "delete",
      model: "Purok",
      description: `Purok '${purok.purok}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Purok deleted successfully" });
  } catch (error) {
    console.error("Error deleting purok:", error);
    res.status(500).json({ error: "Deletion failed" });
  }
}

module.exports = {
  getAllPuroks,
  createPurok,
  updatePurok,
  deletePurok,
};
