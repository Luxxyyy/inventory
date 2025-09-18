const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user_model");

const Note = sequelize.define(
  "Note",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    full_image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
  },
  {
    tableName: "notes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Note.belongsTo(User, { foreignKey: "user_id" });

module.exports = Note;
