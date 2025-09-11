const express = require("express");
const router = express.Router();
const Purok = require("../models/purok_model");
const Balangay = require("../models/balangay_model");
const Source = require("../models/source_model");

router.get("/", async (req, res) => {
  try {
    const puroks = await Purok.findAll({
      include: [
        { model: Balangay, attributes: ["id", "balangay"] },
        { model: Source, attributes: ["id", "source"] },
      ],
      order: [["id", "ASC"]],
    });

    const formatted = puroks.map((p) => ({
      id: p.id,
      purok: p.purok,
      latitude: p.latitude,
      longitude: p.longitude,
      date_added: p.date_added,
      balangay_id: p.Balangay?.id,
      balangay_name: p.Balangay?.balangay,
      source_id: p.Source?.id,
      source_name: p.Source?.source,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching puroks:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/", async (req, res) => {
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

    res.status(201).json(newPurok);
  } catch (error) {
    console.error("Error creating purok:", error);
    res.status(500).json({ error: "Failed to insert purok" });
  }
});

router.put("/:id", async (req, res) => {
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

    res.json({ message: "Purok updated successfully" });
  } catch (error) {
    console.error("Error updating purok:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const purok = await Purok.findByPk(id);
    if (!purok) return res.status(404).json({ error: "Purok not found" });

    await purok.destroy();
    res.json({ message: "Purok deleted successfully" });
  } catch (error) {
    console.error("Error deleting purok:", error);
    res.status(500).json({ error: "Deletion failed" });
  }
});

module.exports = router;
