const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const Statuses = sequelize.define(
  "Status",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      unique:true,
      allowNull:false
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps:false,
  }
);
module.exports = Statuses;
