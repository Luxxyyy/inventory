const { logAction } = require("../utils/logger");

await logAction({
  action: "create",
  model: "Purok",
  description: `Purok '${purok}' created in Balangay ID ${balangay_id}`,
  userId: req.user.id,
});

await logAction({
  action: "delete",
  model: "Purok",
  description: `Purok '${deletedPurok.purok}' deleted`,
  userId: req.user.id,
});
