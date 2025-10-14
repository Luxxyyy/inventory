const express = require("express");
const router = express.Router();
const {
  getOrCreatePrivateConversation,
  getAllConversations,
} = require("../controllers/conversation_controller");

router.use((req, res, next) => {
  req.user = req.user || { id: 1 };
  next();
});

router.post("/", getOrCreatePrivateConversation);

router.get("/", getAllConversations);

module.exports = router;
