const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");
const Categories = require("./categories.model");
const Options = require("./options.model");
const Owners = require("./owners.model");
const Clients = require("./clients.model");

const Products = sequelize.define(
  "Products",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    is_new: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_season: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Products.belongsTo(Options);
Options.hasMany(Products);

Products.belongsTo(Categories);
Categories.hasMany(Products);

Products.belongsTo(Owners);
Owners.hasMany(Products);

Products.belongsTo(Clients);
Clients.hasMany(Products);

module.exports = Products;
