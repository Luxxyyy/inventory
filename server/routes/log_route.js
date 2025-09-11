const express = require("express");
const router = express.Router();

const Log = require("../models/log_model");
const User = require("../models/user_model");

router.get("/", async (req, res) => {
  try {
    const logs = await Log.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "role"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const formatted = logs.map((log) => ({
      id: log.id,
      action: log.action,
      model: log.model,
      description: log.description,
      created_at: log.created_at,
      User: {
        username: log.User?.username || "N/A",
        role: log.User?.role || "N/A",
      },
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
