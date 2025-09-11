const Log = require("../models/log_model");

async function logAction({ action, model, description, userId }) {
  try {
    await Log.create({
      action,
      model,
      description,
      user_id: userId,
    });
  } catch (err) {
    console.error("Failed to log action:", err);
  }
}

module.exports = { logAction };
