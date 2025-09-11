const express = require("express");
const router = express.Router();
const pipeLogController = require("../controllers/pipe_log_controller");

router.get("/:shapeId/logs", pipeLogController.getLogsByShape);
router.post("/:shapeId/logs", pipeLogController.addLog);

module.exports = router;
