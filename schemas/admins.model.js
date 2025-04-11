const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const Admins = sequelize.define(
  "Admins",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
    },
    full_name: {
      type: DataTypes.STRING(100),
    },
    phone_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    is_creator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
module.exports = Admins;
