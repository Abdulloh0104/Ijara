const sequelize = require("../config/db");

const { DataTypes, NOW } = require("sequelize");
const Clients = require("./clients.model");
const Contracts = require("./contracts.model");

const Payments = sequelize.define(
  "Payments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: NOW(),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Payments.belongsTo(Clients);
Clients.hasMany(Payments);

Payments.belongsTo(Contracts);
Contracts.hasMany(Payments);

module.exports = Payments;
