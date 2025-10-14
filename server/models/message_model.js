const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    message_type: {
      type: DataTypes.ENUM("text", "image", "video", "file"),
      defaultValue: "text",
    },
    thumbnail: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    image_fullview: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    chat_type: {
      type: DataTypes.ENUM("private", "public"),
      defaultValue: "private",
    },
    status: {
      type: DataTypes.ENUM("sent", "delivered", "seen"),
      defaultValue: "sent",
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seen_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "messages",
    timestamps: false,
  }
);

module.exports = Message;
