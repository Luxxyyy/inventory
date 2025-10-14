const { User, Message, Conversation } = require("../models/associations");

async function sendMessage(req, res) {
  const {
    conversation_id,
    sender_id,
    receiver_id,
    message,
    message_type,
    chat_type,
    thumbnail,
    image_fullview,
  } = req.body;

  if (!conversation_id || !sender_id) {
    return res
      .status(400)
      .json({ error: "conversation_id and sender_id are required" });
  }

  try {
    const newMessage = await Message.create({
      conversation_id,
      sender_id,
      receiver_id: receiver_id || null,
      message,
      message_type: message_type || "text",
      chat_type: chat_type || "private",
      thumbnail: thumbnail || null,
      image_fullview: image_fullview || null,
      status: "sent",
    });

    await Conversation.update(
      { updated_at: new Date() },
      { where: { id: conversation_id } }
    );

    const io = req.app.get("io");

    if (io) {
      // Emit to receiver
      if (receiver_id) {
        const receiverRoom = `user_${receiver_id}`;
        io.to(receiverRoom).emit("new_message", newMessage);
        console.log(`📩 Sent new_message to ${receiverRoom}`);
      }

      // Emit to sender
      const senderRoom = `user_${sender_id}`;
      io.to(senderRoom).emit("new_message", newMessage);
      console.log(`📤 Sent new_message to ${senderRoom}`);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("❌ Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
}

async function getMessagesByConversation(req, res) {
  const { conversation_id } = req.params;

  try {
    const messages = await Message.findAll({
      where: { conversation_id },
      include: [
        { model: User, as: "Sender", attributes: ["id", "username"] },
        { model: User, as: "Receiver", attributes: ["id", "username"] },
      ],
      order: [["date_added", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error("❌ Fetch messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

module.exports = { sendMessage, getMessagesByConversation };
