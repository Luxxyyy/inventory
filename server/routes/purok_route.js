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

module.exports = router;
