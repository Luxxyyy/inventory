const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByConversation,
} = require("../controllers/message_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.post("/send", sendMessage);

router.get("/conversation/:conversation_id", getMessagesByConversation);

module.exports = router;
