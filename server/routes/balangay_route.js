const express = require("express");
const router = express.Router();
const Balangay = require("../models/balangay_model");
const Source = require("../models/source_model");

router.get("/", async (req, res) => {
  try {
    const balangays = await Balangay.findAll({
      include: [
        {
          model: Source,
          attributes: ["id", "source"],
        },
      ],
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
});

router.post("/", async (req, res) => {
  try {
    console.log("Incoming POST body:", req.body);
    const { balangay, source_id, longitude, latitude } = req.body;

    if (!balangay || !source_id || !longitude || !latitude) {
      console.warn("Validation failed: missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    const source = await Source.findByPk(source_id);
    if (!source) {
      console.warn("Invalid source_id");
      return res.status(400).json({ error: "Invalid source_id" });
    }

    const newBalangay = await Balangay.create({
      balangay,
      source_id,
      longitude,
      latitude,
    });

    console.log("Inserted new balangay:", newBalangay.toJSON());
    res.status(201).json(newBalangay);
  } catch (error) {
    console.error("Balangay insert error:", error);
    res.status(500).json({ error: "Failed to insert balangay" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { balangay, source_id, latitude, longitude } = req.body;

    if (!balangay || !source_id || !latitude || !longitude) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingBalangay = await Balangay.findByPk(id);
    if (!existingBalangay) {
      return res.status(404).json({ error: "Balangay not found" });
    }

    const source = await Source.findByPk(source_id);
    if (!source) {
      return res.status(400).json({ error: "Invalid source_id" });
    }

    await existingBalangay.update({
      balangay,
      source_id,
      latitude,
      longitude,
    });

    res.json({
      message: "Balangay updated successfully",
      balangay: existingBalangay,
    });
  } catch (error) {
    console.error("Balangay update error:", error);
    res.status(500).json({ error: "Failed to update balangay" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const balangay = await Balangay.findByPk(id);
    if (!balangay) {
      return res.status(404).json({ error: "Balangay not found" });
    }

    await balangay.destroy();

    res.json({ message: "Balangay deleted successfully" });
  } catch (error) {
    console.error("Balangay delete error:", error);
    res.status(500).json({ error: "Failed to delete balangay" });
  }
});

module.exports = router;
