const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const Clients = sequelize.define(
  "Clients",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
    },
    first_name: {
      type: DataTypes.STRING(50),
    },
    last_name: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(50),
      unique:true,
      allowNull:true
    },
    phone_number: {
      type: DataTypes.STRING(50),
    },
    frontPassport: {
      type: DataTypes.STRING(50),
    },
    backPassport: {
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.STRING(50),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    password: {
      type: DataTypes.STRING,
    },

    refresh_token: {
      type: DataTypes.TEXT,
    },
    activation_link:{
      type: DataTypes.STRING
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
module.exports = Clients;
