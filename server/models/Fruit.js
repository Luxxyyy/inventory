const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Fruit = sequelize.define('Fruit', {
  fruit_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'fruits',     
  freezeTableName: true,   
  timestamps: false, 
});

module.exports = Fruit;
    