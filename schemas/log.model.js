// models/log.model.js
const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../config/db");

const Log = sequelize.define("logs", {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue:NOW(),
  },
  meta: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

module.exports = Log;
