const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const MapShape = require("./map_shape_model");

const PipeLog = sequelize.define(
  "PipeLog",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    shape_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "map_shapes", key: "id" },
    },
    size: { type: DataTypes.STRING, allowNull: false },
    remarks: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "pipe_logs",
    freezeTableName: true,
    timestamps: false,
  }
);

MapShape.hasMany(PipeLog, { foreignKey: "shape_id", as: "logs" });
PipeLog.belongsTo(MapShape, { foreignKey: "shape_id" });

module.exports = PipeLog;
