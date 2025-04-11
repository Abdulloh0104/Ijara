const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const Options = sequelize.define(
  "Options",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(8,2),
    },
    duration: {
      type: DataTypes.STRING(100),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
module.exports = Options;
