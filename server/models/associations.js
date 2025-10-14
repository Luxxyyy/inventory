const User = require("./user_model");
const Message = require("./message_model");
const Conversation = require("./conversation_model");

// User associations
User.hasMany(Message, { foreignKey: "sender_id", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiver_id", as: "ReceivedMessages" });

User.hasMany(Conversation, {
  foreignKey: "user1_id",
  as: "User1Conversations",
});
User.hasMany(Conversation, {
  foreignKey: "user2_id",
  as: "User2Conversations",
});

// Message associations
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "Sender",
});

Message.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "Receiver",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  as: "Conversation",
});

// Conversation associations
Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "Messages",
});

module.exports = {
  User,
  Message,
  Conversation,
};
