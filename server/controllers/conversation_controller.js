const { User, Conversation } = require("../models/associations");
const { Op } = require("sequelize");

async function getOrCreatePrivateConversation(req, res) {
  let { user1_id, user2_id } = req.body;

  if (!user1_id || !user2_id) {
    return res.status(400).json({ error: "Both user IDs are required" });
  }

  if (user1_id > user2_id) {
    [user1_id, user2_id] = [user2_id, user1_id];
  }

  try {
    let convo = await Conversation.findOne({
      where: {
        user1_id,
        user2_id,
        type: "private",
      },
    });

    if (!convo) {
      convo = await Conversation.create({
        user1_id,
        user2_id,
        type: "private",
      });
    }

    res.json(convo);
  } catch (error) {
    console.error("Conversation error:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve or create conversation" });
  }
}

async function getAllConversations(req, res) {
  const userId = parseInt(req.query.userId, 10);

  if (!userId) {
    return res
      .status(400)
      .json({ error: "userId query parameter is required" });
  }

  try {
    const conversations = await Conversation.findAll({
      where: {
        type: "private",
        [Op.or]: [{ user1_id: userId }, { user2_id: userId }],
      },
      include: [
        { model: User, as: "User1", attributes: ["id", "username", "image"] },
        { model: User, as: "User2", attributes: ["id", "username", "image"] },
      ],
      order: [["updated_at", "DESC"]],
    });

    const publicConversation = {
      id: 0,
      user1_id: null,
      user2_id: null,
      type: "public",
      User1: null,
      User2: null,
    };

    res.json([publicConversation, ...conversations]);
  } catch (error) {
    console.error("Fetch conversations error:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
}

module.exports = {
  getOrCreatePrivateConversation,
  getAllConversations,
};
