const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user_model");

const Log = sequelize.define(
  "Log",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.ENUM("create", "update", "delete"),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Log.belongsTo(User, { foreignKey: "user_id" });

module.exports = Log;
