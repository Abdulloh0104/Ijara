const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const Owners = sequelize.define(
  "Owners",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
    },
    brand: {
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
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(100),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refresh_token: {
      type: DataTypes.TEXT,
    },
    activation_link: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);
module.exports = Owners;
