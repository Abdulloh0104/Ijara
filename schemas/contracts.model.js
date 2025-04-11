const sequelize = require("../config/db");

const { DataTypes, NOW } = require("sequelize");
const Clients = require("./clients.model");
const Statuses = require("./statuses.model");
const Owners = require("./owners.model");
const Products = require("./products.model");

const Contracts = sequelize.define(
  "Contracts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue:NOW()
    },
    end_date: {
      type: DataTypes.DATE,
      defaultValue:NOW()
    },
    receiptPaper:{
      type: DataTypes.TEXT
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Contracts.belongsTo(Clients);
Clients.hasMany(Contracts);

Contracts.belongsTo(Statuses);
Statuses.hasMany(Contracts);

Contracts.belongsTo(Owners);
Owners.hasMany(Contracts);

Contracts.belongsTo(Products);
Products.hasMany(Contracts);
module.exports = Contracts;
